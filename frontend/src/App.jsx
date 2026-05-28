import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:3000/api";

async function req(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}
const getSections = ()        => req("/todolists");
const addSection  = (title)   => req("/todolists", { method: "POST", body: JSON.stringify({ title }) });
const delSection  = (id)      => req(`/todolists/${id}`, { method: "DELETE" });

const getTasks    = (sid)     => req(`/tasks?todoList=${sid}`);
const addTask     = (sid, title) => req("/tasks", { method: "POST", body: JSON.stringify({ title, todoList: sid }) });
const toggleTask  = (id)      => req(`/tasks/${id}/completed`, { method: "PATCH" });
const deleteTask  = (id)      => req(`/tasks/${id}`, { method: "DELETE" });

export default function App() {
  const [section, setSection] = useState(null);
  return (
    <div className="app">
      {section === null
        ? <SectionsView onOpen={setSection} />
        : <TasksView section={section} onBack={() => setSection(null)} />
      }
    </div>
  );
}

function SectionsView({ onOpen }) {
  const [sections, setSections] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSections()
      .then(data => setSections(Array.isArray(data) ? data : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const created = await addSection(name.trim());
      setSections(prev => [...prev, created]);
      setName("");
    } catch (e) { setError(e.message); }
  }

  async function handleDelete(id) {
    try {
      await delSection(id);
      setSections(prev => prev.filter(s => s._id !== id));
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="view">
      <h1>Mis listas</h1>
      <form className="row" onSubmit={handleAdd}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la lista" />
        <button type="submit">Crear</button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}
      {!loading && sections.length === 0 && <p className="muted">No hay listas. Crea una arriba.</p>}
      <ul className="list">
        {sections.map(s => (
          <li key={s._id} className="item" onClick={() => onOpen(s)}>
            <span>{s.title}</span>
            <button className="btn-del" onClick={e => { e.stopPropagation(); handleDelete(s._id); }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TasksView({ section, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    req("/tasks")
      .then(data => {
        const all = Array.isArray(data) ? data : [];
        setTasks(all.filter(t => {
          const id = t.todoList?._id || t.todoList;
          return id === section._id;
        }));
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [section._id]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const created = await addTask(section._id, title.trim());
      setTasks(prev => [...prev, created]);
      setTitle("");
    } catch (e) { setError(e.message); }
  }

  async function handleToggle(task) {
    try {
      const updated = await toggleTask(task._id);
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, ...updated } : t));
    } catch (e) { setError(e.message); }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (e) { setError(e.message); }
  }

  const done  = tasks.filter(t => t.completed).length;
  const total = tasks.length;

  return (
    <div className="view">
      <button className="btn-back" onClick={onBack}>Volver</button>
      <h1>{section.title}</h1>
      {total > 0 && <p className="muted">{done}/{total} completadas</p>}
      <form className="row" onSubmit={handleAdd}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nueva tarea" autoFocus />
        <button type="submit">Agregar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}
      {!loading && tasks.length === 0 && <p className="muted">Sin tareas. Agrega una arriba.</p>}
      <ul className="list">
        {tasks
          .slice()
          .sort((a, b) => Number(a.completed) - Number(b.completed))
          .map(task => (
            <li key={task._id} className={`item ${task.completed ? "done" : ""}`}>
              <input type="checkbox" checked={!!task.completed} onChange={() => handleToggle(task)} />
              <span className="task-title">{task.title}</span>
              <button className="btn-del" onClick={() => handleDelete(task._id)}>Eliminar</button>
            </li>
          ))}
      </ul>
    </div>
  );
}