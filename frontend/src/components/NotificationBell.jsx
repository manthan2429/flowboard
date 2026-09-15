import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api.js";
import { getSocket } from "../lib/socket.js";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    api.get("/notifications").then((res) => setNotifications(res.data));

    const socket = getSocket();
    const handler = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setToast(notification);
      setTimeout(() => setToast((t) => (t?._id === notification._id ? null : t)), 5000);
    };
    socket.on("notification:new", handler);
    return () => socket.off("notification:new", handler);
  }, []);

  const openNotification = async (notification) => {
    setOpen(false);
    if (!notification.read) {
      setNotifications((prev) => prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n)));
      api.patch(`/notifications/${notification._id}/read`).catch(() => {});
    }
    navigate(`/boards/${notification.board}`);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    api.patch("/notifications/read-all").catch(() => {});
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-forestLight transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-rust text-[10px] font-medium flex items-center justify-center text-paper">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-forestLight border border-paper/10 rounded-xl shadow-2xl z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-paper/10">
                <span className="text-sm font-medium text-paper">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-gold hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-paper/40">No notifications yet</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => openNotification(n)}
                    className={`w-full text-left px-4 py-3 border-b border-paper/5 hover:bg-forest transition-colors ${
                      n.read ? "opacity-60" : ""
                    }`}
                  >
                    <p className="text-sm text-paper">{n.message}</p>
                    <p className="text-xs text-paper/40 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </button>
                ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toast && (
            <motion.button
              key={toast._id}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              onClick={() => openNotification(toast)}
              className="bg-forestLight border border-gold/40 rounded-lg px-4 py-3 shadow-2xl text-left max-w-xs"
            >
              <p className="text-sm text-paper">{toast.message}</p>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
