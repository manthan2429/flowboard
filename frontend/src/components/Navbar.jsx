import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-paper/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="font-display font-semibold text-lg">
          FlowBoard
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <NotificationBell />
          <span className="text-paper/60">{user?.name}</span>
          <button onClick={logout} className="text-paper/60 hover:text-paper transition-colors">
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
