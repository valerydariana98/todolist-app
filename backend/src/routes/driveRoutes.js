const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
   uploadFile,
   getFilesByTask,
   deleteFile
} = require("../controllers/driveController");

const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
   fileFilter: (req, file, cb) => {
      const allowedTypes = [
         "image/jpeg",
         "image/png",
         "image/gif",
         "application/pdf",
         "application/msword",
         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
         "text/plain"
      ];

      if (allowedTypes.includes(file.mimetype)) {
         cb(null, true);
      } else {
         cb(new Error("Tipo de archivo no permitido"), false);
      }
   }
});

router.use(authMiddleware);

router.get("/", getFilesByTask);
router.post("/", upload.single("file"), uploadFile);
router.delete("/:fileId", deleteFile);

module.exports = router;