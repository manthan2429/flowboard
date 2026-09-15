import { AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard.jsx";

export default function Column({ status, label, tasks, onDrop, onDragStart, onDelete, onOpen }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, status)}
      className="bg-forestLight/60 border border-paper/10 rounded-xl p-4 min-h-[60vh]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-paper/70 text-sm font-medium">{label}</h3>
        <span className="text-paper/40 text-xs">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onDragStart={onDragStart} onDelete={onDelete} onOpen={onOpen} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
