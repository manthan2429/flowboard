import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateBoardModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
    setName("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center px-6 z-50"
          onClick={onClose}
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="bg-forestLight border border-paper/10 rounded-xl p-6 w-full max-w-sm text-paper"
          >
            <h2 className="font-display text-lg font-semibold">New board</h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q3 Launch"
              className="mt-4 w-full bg-forest border border-paper/15 rounded-md px-3 py-2 outline-none focus:border-gold"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="text-paper/60 px-3 py-2 text-sm">
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gold text-ink font-medium px-4 py-2 rounded-md text-sm hover:bg-goldDim transition-colors"
              >
                Create board
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
