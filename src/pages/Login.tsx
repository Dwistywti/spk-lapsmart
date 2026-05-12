import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, Role } from "../context/AuthContext";
import { motion } from "motion/react";
import { Shield, User, LogIn, Laptop } from "lucide-react";
import { Logo } from "../components/Logo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("user");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    login(username, role);
    const target = role === 'admin' ? '/admin' : from;
    navigate(target, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo showText={false} className="scale-150 mb-4" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Lapsmart — Sistem Pendukung Keputusan Laptop
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white px-4 py-8 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-700">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="block w-full rounded-2xl border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700">Login as</label>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 ring-1 transition-all ${
                    role === "user"
                      ? "bg-blue-50 ring-blue-600 text-blue-700"
                      : "bg-white ring-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <User size={20} />
                  <span className="text-xs font-bold">User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 ring-1 transition-all ${
                    role === "admin"
                      ? "bg-blue-50 ring-blue-600 text-blue-700"
                      : "bg-white ring-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Shield size={20} />
                  <span className="text-xs font-bold">Admin</span>
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-4 text-sm font-bold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95"
              >
                Sign in
                <LogIn size={18} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
