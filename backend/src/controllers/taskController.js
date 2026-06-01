const Task = require("../models/Task");
const AppError = require("../utils/AppError");

const getTasks = async (req, res, next) => {
   try {
      const filter = {
         user: req.user.id
      };

      if (req.query.completed !== undefined) {
         filter.completed = req.query.completed === "true";
      }

      if (req.query.search) {
         filter.title = {
            $regex: req.query.search,
            $options: "i"
         };
      }

      const tasks = await Task.find(filter)
         .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         total: tasks.length,
         data: tasks
      });

   } catch (error) {
      next(error);
   }
};

const getTaskById = async (req, res, next) => {
   try {
      const task = await Task.findOne({
         _id: req.params.id,
         user: req.user.id
      });

      if (!task) {
         return next(
            new AppError("Task not found", 404)
         );
      }

      res.status(200).json({
         success: true,
         data: task
      });

   } catch (error) {
      next(error);
   }
};

const createTask = async (req, res, next) => {
   try {
      const newTask = await Task.create({
         title: req.body.title,
         todoList: req.body.todoList,
         user: req.user.id
      });

      res.status(201).json({
         success: true,
         message: "Task created successfully",
         data: newTask
      });

   } catch (error) {
      next(error);
   }
};

const updateTask = async (req, res, next) => {
   try {
      const updatedTask = await Task.findOneAndUpdate(
         {
            _id: req.params.id,
            user: req.user.id
         },
         req.body,
         {
            new: true,
            runValidators: true
         }
      );

      if (!updatedTask) {
         return next(
            new AppError("Task not found", 404)
         );
      }

      res.status(200).json({
         success: true,
         message: "Task updated successfully",
         data: updatedTask
      });

   } catch (error) {
      next(error);
   }
};

const toggleTaskCompleted = async (req, res, next) => {
   try {
      const task = await Task.findOne({
         _id: req.params.id,
         user: req.user.id
      });

      if (!task) {
         return next(
            new AppError("Task not found", 404)
         );
      }

      task.completed = !task.completed;
      await task.save();

      res.status(200).json({
         success: true,
         message: "Task status updated",
         data: task
      });

   } catch (error) {
      next(error);
   }
};

const deleteTask = async (req, res, next) => {
   try {
      const deletedTask = await Task.findOneAndDelete({
         _id: req.params.id,
         user: req.user.id
      });

      if (!deletedTask) {
         return next(
            new AppError("Task not found", 404)
         );
      }

      res.status(200).json({
         success: true,
         message: "Task deleted successfully"
      });

   } catch (error) {
      next(error);
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