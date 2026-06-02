import { useEffect, useState } from "react";

import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
} from "../services/taskService";

import {
  getGoogleAuthUrl,
  getFiles,
  uploadFile,
  deleteFile,
} from "../services/driveService";

function TasksView({ section, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("googleAccessToken") || null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) {
      localStorage.setItem("googleAccessToken", token);
      setAccessToken(token);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

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
      const created = await addTask(section._id, title.trim());
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
        prev.map((t) => (t._id === task._id ? { ...t, ...updated } : t))
      );
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleConnectDrive() {
    try {
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (error) {
      setError("No se pudo conectar con Google Drive");
    }
  }

  async function handleOpenFiles(task) {
    setSelectedTask(task);
    setFilesLoading(true);
    try {
      const data = await getFiles(task._id);
      setFiles(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setFilesLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file || !accessToken) return;
    setUploading(true);
    try {
      const uploaded = await uploadFile(selectedTask._id, file, accessToken);
      setFiles((prev) => [...prev, uploaded]);
    } catch (error) {
      setError("Error al subir archivo");
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteFile(fileId) {
    if (!accessToken) return;
    try {
      await deleteFile(selectedTask._id, fileId, accessToken);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (error) {
      setError("Error al eliminar archivo");
    }
  }

  const done = tasks.filter((task) => task.completed).length;
  const total = tasks.length;

  return (
    <div className="view">
      <h1>{section.title}</h1>

      {total > 0 && (
        <p className="muted">{done}/{total} completadas</p>
      )}

      <form className="row" onSubmit={handleAdd}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea"
          autoFocus
        />
        <button type="submit">Agregar</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && tasks.length === 0 && (
        <p className="muted">Sin tareas.</p>
      )}

      <ul className="list">
        {tasks
          .slice()
          .sort((a, b) => Number(a.completed) - Number(b.completed))
          .map((task) => (
            <li
              key={task._id}
              className={`item ${task.completed ? "done" : ""}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task)}
              />

              <span className="task-title">{task.title}</span>

              <button
                className="btn-files"
                onClick={() => handleOpenFiles(task)}
              >
                📎 Archivos
              </button>

              <button
                className="btn-del"
                onClick={() => handleDelete(task._id)}
              >
                Eliminar
              </button>
            </li>
          ))}
      </ul>

      {selectedTask && (
        <div className="files-panel">
          <h3>Archivos de: {selectedTask.title}</h3>

          {!accessToken ? (
            <button onClick={handleConnectDrive}>
              Conectar Google Drive
            </button>
          ) : (
            <>
              <label className="btn-upload">
                {uploading ? "Subiendo..." : "Subir archivo"}
                <input
                  type="file"
                  onChange={handleUpload}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
              </label>
            </>
          )}

          {filesLoading && <p className="muted">Cargando archivos...</p>}

          {!filesLoading && files.length === 0 && (
            <p className="muted">Sin archivos adjuntos.</p>
          )}

          <ul className="files-list">
            {files.map((file) => (
              <li key={file._id} className="file-item">
                <a href={file.webViewLink} target="_blank" rel="noreferrer">
                  {file.name}
                </a>
                <button
                  className="btn-del"
                  onClick={() => handleDeleteFile(file._id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <button
            className="btn-back"
            onClick={() => {
              setSelectedTask(null);
              setFiles([]);
            }}
          >
            Cerrar
          </button>
        </div>
      )}

      <button className="btn-back" onClick={onBack}>
        ← Volver a listas
      </button>
    </div>
  );
}

export default TasksView;