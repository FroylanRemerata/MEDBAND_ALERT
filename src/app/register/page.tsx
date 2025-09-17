
"use client";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../../public/CSS/register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    userType: "Assign Wristband",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);
    setLoading(true);
    // Insert patient into Supabase
    const { data, error } = await supabase
      .from('patient')
      .insert([
        {
          name: form.name,
          contact_no: form.contact,
          address: form.address,
          wristband_id: form.userType.startsWith('WB') ? form.userType : null,
        },
      ]);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSubmitted(true);
    setForm({ name: "", contact: "", address: "", userType: "Assign Wristband" });
  };

  return (
    <div className="register-page">
      <header className="topbar">
        <div>
          <h1>Register</h1>
          <p className="subtitle">Managed the selected module here</p>
        </div>
        <Image src="/icons/profile.png" alt="Profile" width={40} height={40} className="profile-pic" />
      </header>
      <section className="register-panel">
        <h2>Register Patient</h2>
  <form className="register-form" onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact No."
              className="input"
              value={form.contact}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="row-textarea">
            <textarea
              name="address"
              placeholder="Address"
              className="textarea"
              value={form.address}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
          </div>
          <div className="row align-end">
            <label htmlFor="user-type" className="block mb-1">User Type</label>
            <select
              id="user-type"
              name="userType"
              className="select"
              title="User Type"
              value={form.userType}
              onChange={handleChange}
              disabled={loading}
            >
              <option>Assign Wristband</option>
              <option>WB001</option>
              <option>WB002</option>
            </select>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
  {error && <div className="error-message">{error}</div>}
  {submitted && <div className="success-message">Registration submitted!</div>}
      </section>
    </div>
  );
}
