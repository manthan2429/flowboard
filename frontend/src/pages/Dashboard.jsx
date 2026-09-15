import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../lib/api.js";
import Navbar from "../components/Navbar.jsx";
import CreateBoardModal from "../components/CreateBoardModal.jsx";

export default function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBoards = () => {
    api.get("/boards").then((res) => setBoards(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const createBoard = async (name) => {
    const res = await api.post("/boards", { name });
    setBoards((prev) => [res.data, ...prev]);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-forest text-paper">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">Your boards</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gold text-ink font-medium px-4 py-2 rounded-md text-sm hover:bg-goldDim transition-colors"
          >
            New board
          </button>
        </div>

        {!loading && boards.length === 0 && (
          <div className="mt-16 text-center text-paper/50">
            <p>No boards yet. Create one to get moving.</p>
          </div>
        )}

        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {boards.map((board, i) => (
            <motion.div
              key={board._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Link
                to={`/boards/${board._id}`}
                className="block bg-forestLight border border-paper/10 rounded-xl p-5 hover:border-gold/50 transition-colors"
              >
                <h3 className="font-display font-semibold">{board.name}</h3>
                <p className="text-paper/50 text-sm mt-2">{board.tasks?.length || 0} tasks</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <CreateBoardModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createBoard} />
    </div>
  );
}
