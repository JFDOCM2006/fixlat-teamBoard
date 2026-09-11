import { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import Card from "./Card";
import Toolbar from "./Toolbar";
import { api } from "../services/api"

function Canvas() {
  const [cards, setCards] = useState([]);

  const [canvasPosition, setCanvasPosition] = useState({
    x: 0,
    y: 0,
  });

  const isDragging = useRef(false);

  const dragStart = useRef({
    x: 0,
    y: 0,
  });

  const canvasStart = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
  const loadNotes = async () => {
    try {
      const data = await api("/notes");

      setCards(
        data.notes.map((note) => ({
          id: note.id,
          title: note.title,
          content: note.content,
          status: note.status,
          x: note.position_x,
          y: note.position_y,
        }))
      );
    } catch (error) {
      console.error("Error cargando notas:", error);
    }
  };

  loadNotes();
}, []);

  // =========================
  // CREAR TARJETA
  // =========================

  const addCard = async () => {
  const positionX = -canvasPosition.x + 100;
  const positionY = -canvasPosition.y + 100;

  try {
    const data = await api("/notes", {
      method: "POST",
      body: JSON.stringify({
        title: "Nueva tarjeta",
        content: "",
        status: "Pendiente",
        position_x: positionX,
        position_y: positionY,
      }),
    });

    const note = data.note;

    const newCard = {
      id: note.id,
      title: note.title,
      content: note.content,
      status: note.status,
      x: note.position_x,
      y: note.position_y,
    };

    setCards((prev) => [...prev, newCard]);
  } catch (error) {
    console.error("Error creando nota:", error);
  }
};

  // =========================
  // ACTUALIZAR POSICIÓN
  // =========================

const updateCardPosition = async (id, x, y) => {
  try {
    await api(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        position_x: Math.round(x),
        position_y: Math.round(y),
      }),
    });

    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              x,
              y,
            }
          : card
      )
    );
  } catch (error) {
    console.error("Error actualizando posición:", error);
  }
};

const updateCard = async (id, updates) => {
  try {
    const data = await api(`/notes/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });

    const note = data.note;

    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? {
              ...card,
              title: note.title,
              content: note.content,
              status: note.status,
              x: note.position_x,
              y: note.position_y,
            }
          : card
      )
    );

    return note;
  } catch (error) {
    console.error("Error actualizando nota:", error);
    throw error;
  }
};

const deleteCard = async (id) => {
  try {
    await api(`/notes/${id}`, {
      method: "DELETE",
    });

    setCards((prev) => prev.filter((card) => card.id !== id));
  } catch (error) {
    console.error("Error eliminando nota:", error);
  }
};

  // =========================
  // INICIAR PAN
  // =========================

  const handleMouseDown = (e) => {
    // No mover el canvas si estamos
    // interactuando con una tarjeta
    if (e.target.closest(".card")) {
      return;
    }

    isDragging.current = true;

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    canvasStart.current = {
      x: canvasPosition.x,
      y: canvasPosition.y,
    };
  };

  // =========================
  // MOVER CANVAS
  // =========================

  const handleMouseMove = (e) => {
    if (!isDragging.current) {
      return;
    }

    const deltaX =
      e.clientX - dragStart.current.x;

    const deltaY =
      e.clientY - dragStart.current.y;

    setCanvasPosition({
      x: canvasStart.current.x + deltaX,
      y: canvasStart.current.y + deltaY,
    });
  };

  // =========================
  // TERMINAR PAN
  // =========================

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* TOOLBAR */}

      <div
        className="absolute right-6 top-6 z-50"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Toolbar onAddCard={addCard} />
      </div>

      {/* FONDO INFINITO */}

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#f8fafc",

          backgroundImage:
            "radial-gradient(#cbd5e1 1px, transparent 1px)",

          backgroundSize: "24px 24px",

          backgroundPosition: `${canvasPosition.x}px ${canvasPosition.y}px`,
        }}
      />

      {/* MUNDO */}

      <div
        className="absolute left-0 top-0"
        style={{
          transform: `translate(
            ${canvasPosition.x}px,
            ${canvasPosition.y}px
          )`,
        }}
      >
        {/* TARJETAS */}

        {cards.map((card) => (
          <Rnd
            key={card.id}
            size={{
              width: 250,
              height: "auto",
            }}
            position={{
              x: card.x,
              y: card.y,
            }}
            onDragStop={(e, data) => {
              updateCardPosition(
                card.id,
                data.x,
                data.y
              );
            }}
            className="card z-10"
          >
            <Card 
            card={card}
            onDelete={deleteCard}
            onUpdate={updateCard}
            />
          </Rnd>
        ))}
      </div>
    </div>
  );
}

export default Canvas;