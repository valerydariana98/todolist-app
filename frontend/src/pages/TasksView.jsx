import { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash, FaFileAlt, FaCloudUploadAlt, FaTimes } from "react-icons/fa";

import {
  getTasks,
  addTask,
  toggleTask,
  deleteTask,
  updateTask,
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
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
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
    const trimmed = title.trim();
    if (!trimmed) return;
    if (trimmed.length > 100) {
      setError("La tarea no puede superar 100 caracteres");
      return;
    }
    try {
      const created = await addTask(section._id, trimmed);
      setTasks((prev) => [...prev, created]);
      setTitle("");
      setError(null);
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
      if (selectedTask?._id === id) {
        setSelectedTask(null);
        setFiles([]);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  function openEdit(task) {
    setEditingTask(task);
    setEditTitle(task.title);
  }

  async function handleEditSave() {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    if (trimmed.length > 100) {
      setError("La tarea no puede superar 100 caracteres");
      return;
    }
    try {
      const updated = await updateTask(editingTask._id, trimmed);
      setTasks((prev) =>
        prev.map((task) => (task._id === editingTask._id ? updated : task))
      );
      if (selectedTask?._id === editingTask._id) {
        setSelectedTask(updated);
      }
      setEditingTask(null);
      setEditTitle("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleConnectDrive() {
    try {
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch {
      setError("No se pudo conectar con Google Drive");
    }
  }

  async function handleSelectTask(task) {
    if (selectedTask?._id === task._id) {
      setSelectedTask(null);
      setFiles([]);
      return;
    }
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
    } catch {
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
    } catch {
      setError("Error al eliminar archivo");
    }
  }

  const done = tasks.filter((task) => task.completed).length;
  const total = tasks.length;

  return (
    <div className="view">
      {/* Header + formulario arriba */}
      <h1>{section.title}</h1>
      {total > 0 && (
        <p className="muted">{done}/{total} completadas</p>
      )}

      <form className="row" onSubmit={handleAdd}>
        <input
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea"
          autoFocus
        />
        <button type="submit">Agregar</button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* Layout de dos columnas abajo */}
      <div className="two-columns">

        {/* ── Columna izquierda: Tareas ── */}
        <div className="column column-tasks">
          <h2 className="column-title">Tareas</h2>

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
                  className={`item ${task.completed ? "done" : ""} ${
                    selectedTask?._id === task._id ? "selected" : ""
                  }`}
                  onClick={() => handleSelectTask(task)}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task)}
                    onClick={(e) => e.stopPropagation()}
                  />

                  <span className="task-title">{task.title}</span>

                  <div className="actions">
                    <button
                      className="icon-btn"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openEdit(task); }}
                    >
                      <FaPencilAlt />
                    </button>

                    <button
                      className="icon-btn delete"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* ── Columna derecha: Archivos ── */}
        <div className="column column-files">
          <h2 className="column-title">
            <FaFileAlt style={{ marginRight: "6px" }} />
            Archivos
          </h2>

          {!selectedTask ? (
            <div className="files-empty-state">
              <p className="muted">
                Hacé clic en una tarea para ver sus archivos adjuntos.
              </p>
            </div>
          ) : (
            <>
              <div className="files-task-header">
                <span className="files-task-name">{selectedTask.title}</span>
                <button
                  className="icon-btn"
                  type="button"
                  title="Cerrar"
                  onClick={() => { setSelectedTask(null); setFiles([]); }}
                >
                  <FaTimes />
                </button>
              </div>

              {!accessToken ? (
                <button className="btn-drive" onClick={handleConnectDrive}>
                  Conectar Google Drive
                </button>
              ) : (
                <label className="btn-upload">
                  <FaCloudUploadAlt style={{ marginRight: "6px" }} />
                  {uploading ? "Subiendo..." : "Subir archivo"}
                  <input
                    type="file"
                    onChange={handleUpload}
                    disabled={uploading}
                    style={{ display: "none" }}
                  />
                </label>
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
                      className="icon-btn delete"
                      type="button"
                      onClick={() => handleDeleteFile(file._id)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Modal editar tarea */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar tarea</h3>
            <input
              value={editTitle}
              maxLength={100}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <div className="modal-actions">
              <button
                type="button"
                className="cancel"
                onClick={() => setEditingTask(null)}
              >
                Cancelar
              </button>
              <button type="button" className="save" onClick={handleEditSave}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="btn-back" onClick={onBack}>
        ← Volver a listas
      </button>
    </div>
  );
}

export default TasksView;