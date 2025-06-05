import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [selectedTasks, setSelectedTasks] = useState(new Set());

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = async () => {
    const trimmed = newTask.trim();
    if (trimmed === "") {
      await Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "La tarea no puede estar vacía",
      });
      return;
    }
    if (tasks.find((t) => t.text.toLowerCase() === trimmed.toLowerCase())) {
      await Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Esa tarea ya existe",
      });
      return;
    }

    setTasks([...tasks, { text: trimmed }]);
    setNewTask("");
    await Swal.fire({
      icon: "success",
      title: "¡Tarea agregada!",
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  const toggleSelectTask = (index) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTasks(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map((_, i) => i)));
    }
  };

  const deleteSelected = async () => {
    if (selectedTasks.size === 0) {
      await Swal.fire({
        icon: "info",
        title: "Nada seleccionado",
        text: "No hay tareas seleccionadas para eliminar.",
      });
      return;
    }

    const result = await Swal.fire({
      title: `¿Seguro que quieres eliminar ${selectedTasks.size} tarea(s) seleccionada(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const newTasks = tasks.filter((_, i) => !selectedTasks.has(i));
      setTasks(newTasks);
      setSelectedTasks(new Set());
      await Swal.fire({
        icon: "success",
        title: "¡Tareas eliminadas!",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  const deleteSingleTask = async (index) => {
    const result = await Swal.fire({
      title: `¿Seguro que quieres eliminar esta tarea?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
      const newSelected = new Set(selectedTasks);
      newSelected.delete(index);
      setSelectedTasks(newSelected);

      await Swal.fire({
        icon: "success",
        title: "¡Tarea eliminada!",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
        }

        .container {
          background: white;
          width: 100%;
          max-width: 500px;
          border-radius: 12px;
          padding: 30px 40px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
          animation: fadeIn 0.7s ease forwards;
        }

        h2 {
          text-align: center;
          color: #444;
          font-weight: 600;
          margin-bottom: 25px;
          letter-spacing: 1.1px;
        }

        .input-area {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        input[type="text"] {
          flex-grow: 1;
          padding: 14px 18px;
          font-size: 17px;
          border: 2px solid #ddd;
          border-radius: 8px;
          transition: border-color 0.3s ease;
          outline-offset: 2px;
          outline-color: #6a11cb;
        }

        input[type="text"]:focus {
          border-color: #2575fc;
          box-shadow: 0 0 8px #2575fcaa;
        }

        button {
          padding: 14px 22px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          color: white;
          transition: background 0.35s ease, transform 0.2s ease;
          box-shadow: 0 4px 12px rgba(101, 70, 255, 0.4);
        }

        button:hover {
          background: linear-gradient(135deg, #2575fc, #6a11cb);
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(101, 70, 255, 0.7);
        }

        button:active {
          transform: scale(0.97);
        }

        .btn-delete {
          background: #e63946;
          box-shadow: 0 4px 10px rgba(230, 57, 70, 0.7);
        }

        .btn-delete:hover {
          background: #d62828;
          box-shadow: 0 6px 16px rgba(214, 40, 40, 0.9);
        }

        .btn-secondary {
          background: #f1f1f1;
          color: #444;
          box-shadow: none;
          border: 1.8px solid #ccc;
          font-weight: 600;
        }

        .btn-secondary:hover {
          background: #ddd;
          border-color: #999;
          box-shadow: 0 0 8px #2575fcaa;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 300px;
          overflow-y: auto;
          border-top: 1px solid #eee;
        }

        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 8px;
          border-bottom: 1px solid #eee;
          background-color: #fafafa;
          border-radius: 8px;
          margin-bottom: 10px;
          opacity: 0;
          animation: fadeInUp 0.5s forwards;
        }

        li:nth-child(odd) {
          background-color: #f4f6fc;
        }

        li:hover {
          background-color: #e8f0fe;
          box-shadow: 0 3px 10px rgba(37, 117, 252, 0.25);
          transform: translateY(-2px);
          transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }

        .task-text {
          flex-grow: 1;
          font-size: 16px;
          font-weight: 500;
          color: #222;
          padding-left: 8px;
          user-select: none;
        }

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #2575fc;
          transition: transform 0.2s ease;
        }

        input[type="checkbox"]:hover {
          transform: scale(1.2);
        }

        .actions {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          justify-content: center;
        }

        .no-tasks {
          text-align: center;
          color: #888;
          font-style: italic;
          margin-top: 30px;
          font-weight: 600;
          user-select: none;
        }

        /* Animations */

        @keyframes fadeIn {
          from {opacity: 0; transform: translateY(-10px);}
          to {opacity: 1; transform: translateY(0);}
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

      `}</style>

      <div className="container">
        <h2>Lista de Tareas</h2>

        {tasks.length > 0 && (
          <div className="actions">
            <button
              onClick={toggleSelectAll}
              className="btn-secondary"
              style={{ minWidth: 150 }}
            >
              {selectedTasks.size === tasks.length
                ? "Deseleccionar todo"
                : "Seleccionar todo"}
            </button>

            <button
              onClick={deleteSelected}
              className="btn-delete"
              style={{ minWidth: 150 }}
            >
              Eliminar seleccionadas
            </button>
          </div>
        )}

        <div className="input-area">
          <input
            type="text"
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button onClick={addTask}>Agregar</button>
        </div>

        {tasks.length === 0 ? (
          <p className="no-tasks">No hay tareas, ¡agrega alguna!</p>
        ) : (
          <ul>
            {tasks.map((task, index) => (
              <li key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <input
                  type="checkbox"
                  checked={selectedTasks.has(index)}
                  onChange={() => toggleSelectTask(index)}
                  aria-label={`Seleccionar tarea: ${task.text}`}
                />
                <span className="task-text">{task.text}</span>

                <button
                  onClick={() => deleteSingleTask(index)}
                  className="btn-delete"
                  aria-label={`Eliminar tarea: ${task.text}`}
                  title="Eliminar tarea"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default TodoApp;
