import { useEffect, useState } from "react";
import {
  getSections,
  addSection,
  deleteSection,
} from "../services/todoListService";

function SectionsView({ onOpen }) {
  const [sections, setSections] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSections()
      .then((data) => setSections(Array.isArray(data) ? data : []))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      const created = await addSection(name.trim());

      setSections((prev) => [...prev, created]);
      setName("");
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSection(id);

      setSections((prev) =>
        prev.filter((section) => section._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="view">
      <h1>Mis listas</h1>

      <form className="row" onSubmit={handleAdd}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la lista"
        />
        <button type="submit">Crear</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Cargando...</p>}

      {!loading && sections.length === 0 && (
        <p className="muted">No hay listas.</p>
      )}

      <ul className="list">
        {sections.map((section) => (
          <li
            key={section._id}
            className="item"
            onClick={() => onOpen(section)}
          >
            <span>{section.title}</span>

            <button
              className="btn-del"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(section._id);
              }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SectionsView;