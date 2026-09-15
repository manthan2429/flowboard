import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const demoCards = [
  { title: "Write auth middleware", status: "done" },
  { title: "Wire up socket rooms", status: "in_progress" },
  { title: "Design board drag states", status: "in_progress" },
  { title: "Ship landing page", status: "todo" },
];

const columns = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-forest text-paper">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <span className="font-display font-semibold text-lg tracking-tight">FlowBoard</span>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/login" className="text-paper/70 hover:text-paper transition-colors">
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-gold text-ink font-medium px-4 py-2 rounded-md hover:bg-goldDim transition-colors"
          >
            Start a board
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-4xl md:text-5xl leading-tight font-semibold">
            The board updates before you finish looking away.
          </h1>
          <p className="mt-5 text-paper/70 text-lg max-w-md">
            FlowBoard keeps small teams in sync in real time — move a card, and everyone watching
            sees it move too. No refresh, no stale state, no "wait, is this done?"
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/register"
              className="bg-gold text-ink font-medium px-5 py-3 rounded-md hover:bg-goldDim transition-colors"
            >
              Create your first board
            </Link>
            <Link to="/login" className="text-paper/70 hover:text-paper transition-colors px-2">
              I already have an account
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 max-w-md">
            <div>
              <dt className="text-paper/50 text-sm">Sync latency</dt>
              <dd className="font-display text-2xl mt-1">&lt;100ms</dd>
            </div>
            <div>
              <dt className="text-paper/50 text-sm">Setup</dt>
              <dd className="font-display text-2xl mt-1">No install</dd>
            </div>
            <div>
              <dt className="text-paper/50 text-sm">Team size</dt>
              <dd className="font-display text-2xl mt-1">Any</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-forestLight rounded-xl p-5 border border-paper/10 shadow-2xl"
        >
          <div className="grid grid-cols-3 gap-4">
            {columns.map((col) => (
              <div key={col.key}>
                <p className="text-paper/50 text-xs mb-3">{col.label}</p>
                <div className="flex flex-col gap-3">
                  {demoCards
                    .filter((c) => c.status === col.key)
                    .map((c) => (
                      <motion.div
                        key={c.title}
                        variants={item}
                        className="bg-forest rounded-lg p-3 border border-paper/10 text-sm"
                      >
                        {c.title}
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display text-xl font-semibold">Live by default</h3>
          <p className="mt-2 text-paper/65 text-sm leading-relaxed">
            Every board is a socket room. When one person moves a card, the change reaches every
            other open tab immediately — nobody has to ask "did you see my update?"
          </p>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Built for small teams</h3>
          <p className="mt-2 text-paper/65 text-sm leading-relaxed">
            No seat limits, no workflow you have to configure before you can use it. Create a
            board, invite people, start moving cards.
          </p>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Your data, your instance</h3>
          <p className="mt-2 text-paper/65 text-sm leading-relaxed">
            FlowBoard is open source and self-hostable. Run it on your own MongoDB instance if you
            don't want your board data anywhere else.
          </p>
        </div>
      </section>

      <footer className="border-t border-paper/10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-paper/40 text-sm">
          FlowBoard — built with the MERN stack.
        </div>
      </footer>
    </div>
  );
}
