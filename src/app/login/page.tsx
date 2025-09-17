

"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import "../../../public/CSS/style.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Custom authentication: check staff table for username and password_hash
    // (In production, use a secure backend API for password validation)
    const { data, error } = await supabase
      .from('staff')
      .select('staff_id, username, password_hash, role')
      .eq('username', username)
      .single();
    setLoading(false);
    if (error || !data) {
      setError("Invalid username or password.");
      return;
    }
    // For demo: compare password as plain text (replace with hash check in production)
    if (data.password_hash !== password) {
      setError("Invalid username or password.");
      return;
    }
    // On success, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="wrapper min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">MALARIA ANIMAL BITE CLINIC</h1>
      <div className="login-container bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        <Image src="/icons/meow_icon.png" alt="Logo" width={80} height={80} />
        <h2 className="text-xl font-semibold mt-4 mb-2">Malaria Animal Bite Clinic Login</h2>
        <p className="mb-4">MedBandAlert</p>
        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter username"
            required
            className="input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Enter password"
            required
            className="input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <div className="options flex items-center">
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled={loading} /> Remember me
            </label>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <div className="footer mt-6 text-xs text-gray-500">
          © 2025 Malaria Animal Bite Clinic. All rights reserved
        </div>
      </div>
    </div>
  );
}
