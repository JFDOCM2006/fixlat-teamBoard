import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import StatusSelect from "./statusSelect";

function Card({ card, onDelete, onUpdate }) {
  const [editingField, setEditingField] = useState(null);

  // =========================================================
  // VALORES GUARDADOS
  // =========================================================

  const [title, setTitle] = useState(card.title || "");
  const [content, setContent] = useState(card.content || "");
  const [status, setStatus] = useState(card.status || "Pendiente");

  // =========================================================
  // VALORES TEMPORALES
  // Estos valores pueden cambiar sin afectar todavía
  // los valores guardados.
  // =========================================================

  const [editTitle, setEditTitle] = useState(card.title || "");
  const [editContent, setEditContent] = useState(card.content || "");
  const [editStatus, setEditStatus] = useState(
    card.status || "Pendiente"
  );

  // =========================================================
  // REFERENCIAS
  // =========================================================

  const cardRef = useRef(null);
  const inputRef = useRef(null);

  // =========================================================
  // ESTADO DEL SELECT DE ESTADO
  // =========================================================

  const [statusOpen, setStatusOpen] = useState(false);

  // =========================================================
  // ENFOCAR INPUT / TEXTAREA
  // =========================================================

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();

      // Ajustar altura inicial del textarea
      if (editingField === "content") {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height =
          `${inputRef.current.scrollHeight}px`;
      }
    }
  }, [editingField]);

  // =========================================================
  // COMPROBAR SI EXISTEN CAMBIOS
  // =========================================================

  const hasChanges =
    title !== editTitle ||
    content !== editContent ||
    status !== editStatus;

  // =========================================================
  // COLORES DE LOS ESTADOS
  // =========================================================

  const statusColor = {
    Pendiente: "bg-yellow-400",
    En_curso: "bg-blue-500",
    Hecho: "bg-green-500",
  };

  // =========================================================
  // CANCELAR AL HACER CLIC FUERA DE LA TARJETA
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(e.target)
      ) {
        if (hasChanges || editingField) {
          cancelEdit();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [hasChanges, editingField]);

  // =========================================================
  // INICIAR EDICIÓN
  // =========================================================
  // Importante:
  // NO volvemos a cargar title/content desde los valores
  // guardados porque podríamos perder cambios temporales.
  // =========================================================

  const startEditing = (field) => {
    setEditingField(field);
  };

  // =========================================================
  // CAMBIAR ESTADO
  // =========================================================

  const changeStatus = (newStatus) => {
    setEditStatus(newStatus);
    setStatusOpen(false);
  };

  // =========================================================
  // CAMBIAR CONTENIDO Y AJUSTAR ALTURA
  // =========================================================

  const handleContentChange = (e) => {
    setEditContent(e.target.value);

    // Reiniciar altura para calcular correctamente
    e.target.style.height = "auto";

    // Ajustar al contenido
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // =========================================================
  // GUARDAR CAMBIOS
  // =========================================================

  const saveEdit = async () => {
    try {
      await onUpdate(card.id, {
        title: editTitle,
        content: editContent,
        status: editStatus,
      });

      // Actualizar valores guardados
      setTitle(editTitle);
      setContent(editContent);
      setStatus(editStatus);

      // Salir del modo edición
      setEditingField(null);
      setStatusOpen(false);

      console.log({
        id: card.id,
        title: editTitle,
        content: editContent,
        status: editStatus,
      });
    } catch (error) {
      console.error("Error guardando cambios:", error);
    }
  };

  // =========================================================
  // CANCELAR CAMBIOS
  // =========================================================
  // Todos los valores temporales vuelven a los valores guardados.
  // =========================================================

  const cancelEdit = () => {
    setEditTitle(title);
    setEditContent(content);
    setEditStatus(status);

    setEditingField(null);
    setStatusOpen(false);
  };

  // =========================================================
  // TECLADO
  // =========================================================

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      ref={cardRef}
      className="card h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">

          {/* Indicador de estado */}
          <div
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              statusColor[editStatus]
            }`}
          />

          {/* TÍTULO */}
          {editingField === "title" ? (
            <input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un título..."
              className="w-full rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-sm font-semibold text-slate-800 outline-none"
            />
          ) : (
            <h3
              onDoubleClick={() => startEditing("title")}
              className="cursor-text truncate rounded-md px-2 py-1 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              title="Doble clic para editar"
            >
              {editTitle || "Sin título"}
            </h3>
          )}
        </div>
      </div>

      {/* =====================================================
          CONTENIDO
      ====================================================== */}

      <div className="px-4 py-3">
        {editingField === "content" ? (
          <textarea
            ref={inputRef}
            value={editContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe algo..."
            className="min-h-[75px] w-full resize-none overflow-hidden rounded-md border border-blue-300 bg-blue-50 p-2 text-sm leading-5 text-slate-600 outline-none"
          />
        ) : (
          <p
            onDoubleClick={() => startEditing("content")}
            className="whitespace-pre-wrap break-words rounded-md p-2 text-sm leading-5 text-slate-600 hover:bg-slate-50"
            title="Doble clic para editar"
          >
            {editContent || "Escribe algo..."}
          </p>
        )}
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="flex items-center justify-between px-4 pb-3">

        {/* SELECT DE ESTADO */}

        <StatusSelect
          status={editStatus}
          onChange={changeStatus}
          open={statusOpen}
          onToggle={() => setStatusOpen(!statusOpen)}
        />

        <div className="flex items-center gap-1">

          {/* =================================================
              GUARDAR
          ================================================== */}

          {hasChanges && (
            <button
              onClick={saveEdit}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600"
            >
              Guardar
            </button>
          )}

          {/* =================================================
              ELIMINAR
          ================================================== */}

          <button
            onClick={() => onDelete(card.id)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;