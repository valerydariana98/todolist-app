const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

   title: {
      type: String,
      required: true
   },

   completed: {
      type: Boolean,
      default: false
   },

   todoList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TodoList"
   }

}, {
   timestamps: true
});

module.exports = mongoose.model("Task", taskSchema);