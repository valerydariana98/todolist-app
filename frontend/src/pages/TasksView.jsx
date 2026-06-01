import { useEffect, useState } from "react";

import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
} from "../services/taskService";

function TasksView({ section, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTasks()
      .then((data) => {
        const all = Array.isArray(data) ? data : [];

        setTasks(
          all.filter((task) => {
            const id = task.todoList?._id || task.todoList;
            return id === section._id;
          })
        );
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [section._id]);

  async function handleAdd(e) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const created = await addTask(
        section._id,
        title.trim()
      );

      setTasks((prev) => [...prev, created]);
      setTitle("");
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleToggle(task) {
    try {
      const updated = await toggleTask(task._id);

      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id
            ? { ...t, ...updated }
            : t
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);

      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  }

  const done = tasks.filter(
    (task) => task.completed
  ).length;

  const total = tasks.length;

  return (
    <div className="view">

      <h1>{section.title}</h1>

      {total > 0 && (
        <p className="muted">
          {done}/{total} completadas
        </p>
      )}

      <form className="row" onSubmit={handleAdd}>
        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Nueva tarea"
          autoFocus
        />

        <button type="submit">
          Agregar
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && tasks.length === 0 && (
        <p className="muted">
          Sin tareas.
        </p>
      )}

      <ul className="list">
        {tasks
          .slice()
          .sort(
            (a, b) =>
              Number(a.completed) -
              Number(b.completed)
          )
          .map((task) => (
            <li
              key={task._id}
              className={`item ${
                task.completed ? "done" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  handleToggle(task)
                }
              />

              <span className="task-title">
                {task.title}
              </span>

              <button
                className="btn-del"
                onClick={() =>
                  handleDelete(task._id)
                }
              >
                Eliminar
              </button>
            </li>
          ))}
      </ul>

      <button
        className="btn-back"
        onClick={onBack}
      >
        ← Volver a listas
      </button>
      
    </div>
  );
}

export default TasksView;