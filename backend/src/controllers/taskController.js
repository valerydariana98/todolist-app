const Task = require("../models/Task");

const getTasks = async (req, res) => {

   try {

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const tasks = await Task.find()
         .populate("todoList")
         .skip(skip)
         .limit(limit);

      const total = await Task.countDocuments();

      res.status(200).json({

         data: tasks,

         meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
         },

         links: {
            self: `/api/tasks?page=${page}&limit=${limit}`
         }

      });

   } catch (error) {

      res.status(500).json({
         error: {
            message: error.message,
            status: 500
         }
      });

   }

};

const getTaskById = async (req, res) => {

   try {

      const task = await Task.findById(req.params.id)
         .populate("todoList");

      if (!task) {

         return res.status(404).json({
            error: {
               message: "Task not found",
               status: 404
            }
         });

      }

      res.status(200).json({
         data: task
      });

   } catch (error) {

      res.status(500).json({
         error: {
            message: error.message,
            status: 500
         }
      });

   }

};

const createTask = async (req, res) => {

   try {

      if (!req.body.title) {
         return res.status(400).json({
            error: {
               message: "Title is required",
               status: 400
            }
         });
      }

      const newTask = new Task({
         title: req.body.title,
         todoList: req.body.todoList
      });

      const savedTask = await newTask.save();

      res.status(201).json({
         data: savedTask
      });

   } catch (error) {

      res.status(500).json({
         error: {
            message: error.message,
            status: 500
         }
      });
   }
};

const updateTask = async (req, res) => {

   try {

      const updatedTask = await Task.findByIdAndUpdate(
         req.params.id,
         {
            title: req.body.title
         },

         {
            new: true,
            runValidators: true
         }

      );

      if (!updatedTask) {
         return res.status(404).json({
            error: {
               message: "Task not found",
               status: 404
            }
         });
      }

      res.status(200).json({
         data: updatedTask
      });

   } catch (error) {

      res.status(500).json({
         error: {
            message: error.message,
            status: 500
         }
      });

   }

};

const toggleTaskCompleted = async (req, res) => {

   try {

      const task = await Task.findById(req.params.id);

      if (!task) {
         return res.status(404).json({
            error: {
               message: "Task not found",
               status: 404
            }
         });
      }

      task.completed = !task.completed;

      await task.save();

      res.status(200).json({
         data: task
      });

   } catch (error) {

      res.status(500).json({
         error: {
            message: error.message,
            status: 500
         }
      });

   }

};

const deleteTask = async (req, res) => {

   try {

      const deletedTask = await Task.findByIdAndDelete(req.params.id);

      if (!deletedTask) {

         return res.status(404).json({
            error: {
               message: "Task not found",
               status: 404
            }
         });

      }

      res.status(204).send();

   } catch (error) {

      res.status(500).json({
         error: {
            message: error.message,
            status: 500
         }
      });

   }

};

module.exports = {

   getTasks,
   getTaskById,
   createTask,
   updateTask,
   toggleTaskCompleted,
   deleteTask
};