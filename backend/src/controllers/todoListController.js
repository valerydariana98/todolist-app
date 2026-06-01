const TodoList = require("../models/TodoList");
const AppError = require("../utils/AppError");

const getAllTodoLists = async (req, res, next) => {
   try {
      const todoLists = await TodoList.find({
         user: req.user.id
      }).sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         total: todoLists.length,
         data: todoLists
      });

   } catch (error) {
      next(error);
   }
};

const getTodoListById = async (req, res, next) => {
   try {
      const todoList = await TodoList.findOne({
         _id: req.params.id,
         user: req.user.id
      });

      if (!todoList) {
         return next(
            new AppError("Todo list not found", 404)
         );
      }

      res.status(200).json({
         success: true,
         data: todoList
      });

   } catch (error) {
      next(error);
   }
};

const createTodoList = async (req, res, next) => {
   try {
      const todoList = await TodoList.create({
         title: req.body.title,
         user: req.user.id
      });

      res.status(201).json({
         success: true,
         message: "Todo list created successfully",
         data: todoList
      });

   } catch (error) {
      next(error);
   }
};

const updateTodoList = async (req, res, next) => {
   try {
      const updatedTodoList = await TodoList.findOneAndUpdate(
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

      if (!updatedTodoList) {
         return next(
            new AppError("Todo list not found", 404)
         );
      }

      res.status(200).json({
         success: true,
         message: "Todo list updated successfully",
         data: updatedTodoList
      });

   } catch (error) {
      next(error);
   }
};

const deleteTodoList = async (req, res, next) => {
   try {
      const deletedTodoList = await TodoList.findOneAndDelete({
         _id: req.params.id,
         user: req.user.id
      });

      if (!deletedTodoList) {
         return next(
            new AppError("Todo list not found", 404)
         );
      }

      res.status(200).json({
         success: true,
         message: "Todo list deleted successfully"
      });

   } catch (error) {
      next(error);
   }
};

module.exports = {
   getAllTodoLists,
   getTodoListById,
   createTodoList,
   updateTodoList,
   deleteTodoList
};