const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

   title: {
      type: String,
      required: true,
      trim: true,       //elimina espacios
      minlength: 1,
      maxlength: 100
   },

   completed: {
      type: Boolean,
      default: false
   },

   todoList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TodoList",
      required: true
   }

}, {
   timestamps: true
});

module.exports = mongoose.model("Task", taskSchema);