const mongoose = require("mongoose");

const driveFileSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   mimeType: {
      type: String,
      required: true
   },
   driveFileId: {
      type: String,
      required: true
   },
   webViewLink: {
      type: String,
      required: true
   },
   task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   }
}, {
   timestamps: true
});

module.exports = mongoose.model("DriveFile", driveFileSchema);