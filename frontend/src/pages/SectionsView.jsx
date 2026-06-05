import { useEffect, useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

import {
  getSections,
  addSection,
  updateSection,
  deleteSection,
} from "../services/todoListService";

function SectionsView({ onOpen }) {
  const [sections, setSections] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingSection, setEditingSection] =
    useState(null);

  const [editTitle, setEditTitle] =
    useState("");

  useEffect(() => {
    getSections()
      .then((data) =>
        setSections(
          Array.isArray(data) ? data : []
        )
      )
      .catch((error) =>
        setError(error.message)
      )
      .finally(() =>
        setLoading(false)
      );
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) return;

    if (trimmed.length > 100) {
      setError(
        "El nombre de la lista no puede superar 100 caracteres"
      );
      return;
    }

    try {
      const created =
        await addSection(trimmed);

      setSections((prev) => [
        ...prev,
        created,
      ]);

      setName("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSection(id);

      setSections((prev) =>
        prev.filter(
          (section) =>
            section._id !== id
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  function openEdit(section) {
    setEditingSection(section);
    setEditTitle(section.title);
  }

  async function handleEditSave() {
    const trimmed =
      editTitle.trim();

    if (!trimmed) return;

    if (trimmed.length > 100) {
      setError(
        "El nombre de la lista no puede superar 100 caracteres"
      );
      return;
    }

    try {
      const updated =
        await updateSection(
          editingSection._id,
          trimmed
        );

      setSections((prev) =>
        prev.map((section) =>
          section._id ===
          editingSection._id
            ? updated
            : section
        )
      );

      setEditingSection(null);
      setEditTitle("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="view">
      <h1>Mis listas</h1>

      <form
        className="row"
        onSubmit={handleAdd}
      >
        <input
          value={name}
          maxLength={100}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          placeholder="Nombre de la lista"
        />

        <button type="submit">
          Crear
        </button>
      </form>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {loading && (
        <p className="muted">
          Cargando...
        </p>
      )}

      {!loading &&
        sections.length === 0 && (
          <p className="muted">
            No hay listas.
          </p>
        )}

      <ul className="list">
        {sections.map(
          (section) => (
            <li
              key={section._id}
              className="item"
              onClick={() =>
                onOpen(section)
              }
            >
              <span className="section-title">
                {section.title}
              </span>

              <div className="actions">
                <button
                  className="icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(
                      section
                    );
                  }}
                >
                  <FaPencilAlt />
                </button>

                <button
                  className="icon-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();

                    handleDelete(
                      section._id
                    );
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          )
        )}
      </ul>

      {editingSection && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              Editar lista
            </h3>

            <input
              value={editTitle}
              maxLength={100}
              onChange={(e) =>
                setEditTitle(
                  e.target.value
                )
              }
            />

            <div className="modal-actions">
              <button
                className="cancel"
                onClick={() =>
                  setEditingSection(
                    null
                  )
                }
              >
                Cancelar
              </button>

              <button
                className="save"
                onClick={
                  handleEditSave
                }
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectionsView;