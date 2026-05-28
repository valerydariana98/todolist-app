const Task = require("../models/Task");
const AppError = require("../utils/AppError");

const getTasks = async (req, res, next) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const filter = {};

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
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      const total = await Task.countDocuments(filter);

      res.status(200).json({
         success: true,
         page,
         limit,
         total,
         data: tasks
      });

   } catch (error) {
      next(error);
   }
};

const getTaskById = async (req, res, next) => {
   try {
      const task = await Task.findById(req.params.id);
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
      const newTask = await Task.create(req.body);
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
      const updatedTask = await Task.findByIdAndUpdate(
         req.params.id,
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
      const task = await Task.findById(req.params.id);
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
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
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