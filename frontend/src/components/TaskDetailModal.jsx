import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskDetailModal({ task, members = [], onClose, onSave, onDelete }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setAssigneeId(task.assignee?._id || "");
    }
  }, [task]);

  if (!task) return null;

  const save = () => {
    if (!title.trim()) return;
    onSave(task._id, { title: title.trim(), description, assigneeId: assigneeId || null });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-forestLight border border-paper/10 rounded-xl p-6 w-full max-w-md text-paper"
        >
          <label className="block text-xs text-paper/50">Title</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full bg-forest border border-paper/15 rounded-md px-3 py-2 outline-none focus:border-gold font-display font-medium"
          />

          <label className="block text-xs text-paper/50 mt-4">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Add more detail for teammates..."
            className="mt-1 w-full bg-forest border border-paper/15 rounded-md px-3 py-2 outline-none focus:border-gold text-sm resize-none"
          />

          <label className="block text-xs text-paper/50 mt-4">Assign to</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="mt-1 w-full bg-forest border border-paper/15 rounded-md px-3 py-2 outline-none focus:border-gold text-sm"
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={() => {
                onDelete(task._id);
                onClose();
              }}
              className="text-rust text-sm hover:underline"
            >
              Delete task
            </button>
            <div className="flex gap-3">
              <button onClick={onClose} className="text-paper/60 px-3 py-2 text-sm">
                Cancel
              </button>
              <button
                onClick={save}
                className="bg-gold text-ink font-medium px-4 py-2 rounded-md text-sm hover:bg-goldDim transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
