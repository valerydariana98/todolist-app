const TodoList = require("../models/TodoList");
const Task = require("../models/Task");

const getAllTodoLists = async (req, res) => {
   try {

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const todoLists = await TodoList.find()
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      const total = await TodoList.countDocuments();

      res.status(200).json({

         data: todoLists,

         meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
         },

         links: {
            self: `/api/todolists?page=${page}&limit=${limit}`
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

const getTodoListById = async (req, res) => {

   try {

      const todoList = await TodoList.findById(req.params.id);

      if (!todoList) {

         return res.status(404).json({
            error: {
               message: "TodoList not found",
               status: 404
            }
         });
      }

      res.status(200).json({
         data: todoList
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

const createTodoList = async (req, res) => {

   try {

      const { title, user } = req.body;

      if (!title || title.trim() === "") {
         return res.status(400).json({
            error: {
               message: "Title is required",
               status: 400
            }
         });
      }

      const todoList = await TodoList.create({
         title,
         user
      });

      res.status(201).json({
         data: todoList
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

const updateTodoList = async (req, res) => {

   try {

      const { title, user } = req.body;

      if (title !== undefined && title.trim() === "") {
         return res.status(400).json({
            error: {
               message: "Title cannot be empty",
               status: 400
            }
         });

      }

      const updatedTodoList = await TodoList.findByIdAndUpdate(
         req.params.id,
         {
            title,
            user
         },

         {
            new: true,
            runValidators: true
         }
      );

      if (!updatedTodoList) {
         return res.status(404).json({
            error: {
               message: "TodoList not found",
               status: 404
            }
         });
      }

      res.status(200).json({
         data: updatedTodoList
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

const deleteTodoList = async (req, res) => {

   try {

      const deletedTodoList = await TodoList.findByIdAndDelete(req.params.id);

      if (!deletedTodoList) {
         return res.status(404).json({
            error: {
               message: "TodoList not found",
               status: 404
            }
         });
      }

      await Task.deleteMany({
         todoList: req.params.id
      });

      res.status(204).send();

   } catch (error) {

      res.status(500).json({
         error: {
            message: error.message,
            status: 500
         }
      })
   }
};

module.exports = {

   getAllTodoLists,
   getTodoListById,
   createTodoList,
   updateTodoList,
   deleteTodoList

};