import { motion } from "framer-motion";

export default function TaskCard({ task, onDragStart, onDelete, onOpen }) {
  return (
    <motion.div
      layout
      layoutId={task._id}
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={() => onOpen(task)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -2 }}
      className="group bg-forest border border-paper/10 rounded-lg p-3 text-sm cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p>{task.title}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-paper/40 hover:text-rust text-xs shrink-0"
        >
          Remove
        </button>
      </div>
      {task.description && <p className="text-paper/50 text-xs mt-1 line-clamp-2">{task.description}</p>}
    </motion.div>
  );
}
