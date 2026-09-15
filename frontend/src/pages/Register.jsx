import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-forest text-paper flex items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={submit}
        className="bg-forestLight border border-paper/10 rounded-xl p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-2xl font-semibold">Create your account</h1>
        <p className="text-paper/60 text-sm mt-1">Start your first board in under a minute.</p>

        {error && <p className="mt-4 text-sm text-rust bg-rust/10 border border-rust/30 rounded-md px-3 py-2">{error}</p>}

        <label className="block mt-6 text-sm text-paper/70">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full bg-forest border border-paper/15 rounded-md px-3 py-2 outline-none focus:border-gold"
        />

        <label className="block mt-4 text-sm text-paper/70">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full bg-forest border border-paper/15 rounded-md px-3 py-2 outline-none focus:border-gold"
        />

        <label className="block mt-4 text-sm text-paper/70">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full bg-forest border border-paper/15 rounded-md px-3 py-2 outline-none focus:border-gold"
        />

        <button
          type="submit"
          className="mt-6 w-full bg-gold text-ink font-medium py-2.5 rounded-md hover:bg-goldDim transition-colors"
        >
          Create account
        </button>

        <p className="mt-4 text-sm text-paper/60">
          Already have an account?{" "}
          <Link to="/login" className="text-gold">
            Log in
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
