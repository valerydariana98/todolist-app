const TodoList = require("../models/TodoList");

const getAllTodoLists = async (req, res) => {
  try {
    const todoLists = await TodoList.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: todoLists.length, data: todoLists });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener las listas", error: error.message });
  }
};

const getTodoListById = async (req, res) => {
  try {
    const todoList = await TodoList.findById(req.params.id);
    if (!todoList) return res.status(404).json({ success: false, message: "Lista no encontrada" });
    res.status(200).json({ success: true, data: todoList });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener la lista", error: error.message });
  }
};

const createTodoList = async (req, res) => {
  try {
    const { title, user } = req.body;
    if (!title || title.trim() === "") return res.status(400).json({ success: false, message: "El título es obligatorio" });
    const todoList = await TodoList.create({ title, user });
    res.status(201).json({ success: true, message: "Lista creada exitosamente", data: todoList });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear la lista", error: error.message });
  }
};

const updateTodoList = async (req, res) => {
  try {
    const { title, user } = req.body;
    if (title !== undefined && title.trim() === "") return res.status(400).json({ success: false, message: "El título no puede estar vacío" });
    const todoList = await TodoList.findByIdAndUpdate(req.params.id, { title, user }, { new: true, runValidators: true });
    if (!todoList) return res.status(404).json({ success: false, message: "Lista no encontrada" });
    res.status(200).json({ success: true, message: "Lista actualizada exitosamente", data: todoList });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar la lista", error: error.message });
  }
};

const deleteTodoList = async (req, res) => {
  try {
    const todoList = await TodoList.findByIdAndDelete(req.params.id);
    if (!todoList) return res.status(404).json({ success: false, message: "Lista no encontrada" });
    res.status(200).json({ success: true, message: "Lista eliminada exitosamente", data: todoList });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar la lista", error: error.message });
  }
};

module.exports = { getAllTodoLists, getTodoListById, createTodoList, updateTodoList, deleteTodoList };