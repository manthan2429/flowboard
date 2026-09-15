import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api.js";
import { getSocket } from "../lib/socket.js";
import Navbar from "../components/Navbar.jsx";
import Column from "../components/Column.jsx";
import TaskDetailModal from "../components/TaskDetailModal.jsx";
import InviteModal from "../components/InviteModal.jsx";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

export default function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    api.get(`/boards/${id}`).then((res) => setBoard(res.data));

    const socket = getSocket();
    socket.emit("board:join", id);
    const handler = (updated) => {
      if (updated._id === id) setBoard(updated);
    };
    socket.on("board:updated", handler);

    return () => {
      socket.emit("board:leave", id);
      socket.off("board:updated", handler);
    };
  }, [id]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await api.post(`/boards/${id}/tasks`, { title: newTitle.trim() });
    setBoard(res.data);
    setNewTitle("");
  };

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const onDrop = useCallback(
    async (e, status) => {
      const taskId = e.dataTransfer.getData("text/plain");
      if (!taskId || !board) return;
      setBoard((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t._id === taskId ? { ...t, status } : t)),
      }));
      const res = await api.patch(`/boards/${id}/tasks/${taskId}`, { status });
      setBoard(res.data);
    },
    [board, id]
  );

  const onDelete = async (taskId) => {
    const res = await api.delete(`/boards/${id}/tasks/${taskId}`);
    setBoard(res.data);
  };

  const onSaveTask = async (taskId, updates) => {
    const res = await api.patch(`/boards/${id}/tasks/${taskId}`, updates);
    setBoard(res.data);
  };

  const onInvite = async (email) => {
    const res = await api.post(`/boards/${id}/members`, { email });
    setBoard(res.data);
  };

  if (!board) {
    return (
      <div className="min-h-screen bg-forest text-paper">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest text-paper">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Link to="/dashboard" className="text-paper/50 text-sm hover:text-paper">
              ← All boards
            </Link>
            <h1 className="font-display text-2xl font-semibold mt-1">{board.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInviteOpen(true)}
              className="flex items-center gap-2 bg-forestLight border border-paper/10 rounded-md px-3 py-2 text-sm hover:border-gold/50 transition-colors"
            >
              <div className="flex -space-x-2">
                {(board.members || []).slice(0, 4).map((m) => (
                  <span
                    key={m._id}
                    className="w-6 h-6 rounded-full border-2 border-forest flex items-center justify-center text-[10px] font-medium text-ink"
                    style={{ backgroundColor: m.avatarColor || "#E8B34E" }}
                    title={m.name}
                  >
                    {m.name?.[0]?.toUpperCase()}
                  </span>
                ))}
              </div>
              <span className="text-paper/60">Members</span>
            </button>

            <form onSubmit={addTask} className="flex gap-2">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a task"
                className="bg-forestLight border border-paper/15 rounded-md px-3 py-2 text-sm outline-none focus:border-gold w-52"
              />
              <button
                type="submit"
                className="bg-gold text-ink font-medium px-4 py-2 rounded-md text-sm hover:bg-goldDim transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {COLUMNS.map((col) => (
            <Column
              key={col.key}
              status={col.key}
              label={col.label}
              tasks={board.tasks
                .filter((t) => t.status === col.key)
                .sort((a, b) => a.order - b.order)}
              onDrop={onDrop}
              onDragStart={onDragStart}
              onDelete={onDelete}
              onOpen={setActiveTask}
            />
          ))}
        </div>
      </main>

      <TaskDetailModal
        task={activeTask}
        members={board.members || []}
        onClose={() => setActiveTask(null)}
        onSave={onSaveTask}
        onDelete={onDelete}
      />

      <InviteModal
        open={inviteOpen}
        members={board.members || []}
        onClose={() => setInviteOpen(false)}
        onInvite={onInvite}
      />
    </div>
  );
}
