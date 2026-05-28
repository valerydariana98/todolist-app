const mongoose = require("mongoose");

const todoListSchema = new mongoose.Schema({

   title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100
   },

   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: true     //obligatorio cuando implementemos usuarios
   }

}, {
   timestamps: true
});

module.exports = mongoose.model("TodoList", todoListSchema);