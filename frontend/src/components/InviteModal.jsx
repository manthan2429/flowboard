import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InviteModal({ open, members, onClose, onInvite }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSending(true);
    try {
      await onInvite(email.trim());
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't add that person");
    } finally {
      setSending(false);
    }
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
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-forestLight border border-paper/10 rounded-xl p-6 w-full max-w-sm text-paper"
          >
            <h2 className="font-display text-lg font-semibold">Board members</h2>

            <ul className="mt-4 flex flex-col gap-2 max-h-40 overflow-y-auto">
              {members.map((m) => (
                <li key={m._id} className="flex items-center gap-2 text-sm">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium text-ink"
                    style={{ backgroundColor: m.avatarColor || "#E8B34E" }}
                  >
                    {m.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="text-paper/80">{m.name}</span>
                  <span className="text-paper/40 text-xs">{m.email}</span>
                </li>
              ))}
            </ul>

            <form onSubmit={submit} className="mt-5">
              <label className="block text-xs text-paper/50">Invite by email</label>
              {error && <p className="mt-1 text-xs text-rust">{error}</p>}
              <div className="mt-1 flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@example.com"
                  className="flex-1 bg-forest border border-paper/15 rounded-md px-3 py-2 text-sm outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-gold text-ink font-medium px-4 py-2 rounded-md text-sm hover:bg-goldDim transition-colors disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              <p className="mt-2 text-xs text-paper/40">
                They need a FlowBoard account with this email already — there's no email invite
                system yet, so double-check they've signed up first.
              </p>
            </form>

            <button onClick={onClose} className="mt-4 text-paper/60 text-sm">
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
