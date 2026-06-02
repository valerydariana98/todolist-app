const { Readable } = require("stream");
const { google } = require("googleapis");
const { oauth2Client } = require("../config/googleDrive");
const DriveFile = require("../models/DriveFile");
const AppError = require("../utils/AppError");

const getAuthUrl = (req, res) => {
   const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
         "https://www.googleapis.com/auth/drive.file",
         "https://www.googleapis.com/auth/userinfo.email"
      ],
      state: req.user.id
   });

   res.status(200).json({ success: true, url });
};

const handleCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) return next(new AppError("No authorization code received", 400));

    const { tokens } = await oauth2Client.getToken(code);

    // Redirige al frontend con el access token
    res.redirect(
      `${process.env.CLIENT_URL}?access_token=${tokens.access_token}`
    );

  } catch (error) {
    next(error);
  }
};
const uploadFile = async (req, res, next) => {
   try {
      if (!req.file) return next(new AppError("No file provided", 400));

      const { accessToken } = req.body;
      if (!accessToken) return next(new AppError("Google access token required", 401));

      const userAuth = new google.auth.OAuth2(
         process.env.GOOGLE_CLIENT_ID,
         process.env.GOOGLE_CLIENT_SECRET,
         process.env.GOOGLE_REDIRECT_URI
      );
      userAuth.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: "v3", auth: userAuth });

      const fileStream = Readable.from(req.file.buffer);

      const response = await drive.files.create({
         requestBody: {
            name: req.file.originalname,
            mimeType: req.file.mimetype
         },
         media: {
            mimeType: req.file.mimetype,
            body: fileStream
         },
         fields: "id, name, mimeType, webViewLink"
      });

      await drive.permissions.create({
         fileId: response.data.id,
         requestBody: {
            role: "reader",
            type: "anyone"
         }
      });

      const driveFile = await DriveFile.create({
         name: response.data.name,
         mimeType: response.data.mimeType,
         driveFileId: response.data.id,
         webViewLink: response.data.webViewLink,
         task: req.params.taskId,
         user: req.user.id
      });

      res.status(201).json({
         success: true,
         message: "File uploaded successfully",
         data: driveFile
      });

   } catch (error) {
      next(error);
   }
};

const getFilesByTask = async (req, res, next) => {
   try {
      const files = await DriveFile.find({
         task: req.params.taskId,
         user: req.user.id
      }).sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         total: files.length,
         data: files
      });

   } catch (error) {
      next(error);
   }
};

const deleteFile = async (req, res, next) => {
   try {
      const { accessToken } = req.body;
      if (!accessToken) return next(new AppError("Google access token required", 401));

      const file = await DriveFile.findOne({
         _id: req.params.fileId,
         user: req.user.id
      });

      if (!file) return next(new AppError("File not found", 404));

      const userAuth = new google.auth.OAuth2(
         process.env.GOOGLE_CLIENT_ID,
         process.env.GOOGLE_CLIENT_SECRET,
         process.env.GOOGLE_REDIRECT_URI
      );
      userAuth.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: "v3", auth: userAuth });

      await drive.files.delete({ fileId: file.driveFileId });
      await DriveFile.findByIdAndDelete(file._id);

      res.status(200).json({
         success: true,
         message: "File deleted successfully"
      });

   } catch (error) {
      next(error);
   }
};

module.exports = {
   getAuthUrl,
   handleCallback,
   uploadFile,
   getFilesByTask,
   deleteFile
};