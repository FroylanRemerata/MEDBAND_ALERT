
"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../../public/CSS/dashy.css";
import "../../../public/CSS/billing.css";

interface Bill {
  id: string;
  patient: string;
  amount: number;
  date: string;
  paid: boolean;
}

function generateBillId() {
  return Math.floor(Math.random() * 10000).toString();
}

export default function Billing() {
  "use client";
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;
    setDeleting(id);
    const { error } = await supabase
      .from('billing')
      .delete()
      .eq('billing_id', id);
    setDeleting(null);
    if (error) {
      alert('Error deleting bill: ' + error.message);
      return;
    }
    setBills((prev) => prev.filter((b) => b.id !== id));
  };
  const [selectedPatient, setSelectedPatient] = useState("");
  const [amount, setAmount] = useState("");
  const patientSelectRef = useRef<HTMLSelectElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('billing')
        .select('billing_id, patient_id, amount, status, date_issued');
      if (error) {
        setError(error.message);
      } else {
        setBills(
          (data || []).map((bill: any) => ({
            id: bill.billing_id,
            patient: bill.patient_id,
            amount: bill.amount,
            date: bill.date_issued,
            paid: bill.status === 'paid',
          }))
        );
      }
      setLoading(false);
    };
    fetchBills();
  }, []);

  const handleCreateBill = async () => {
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) {
      alert("Please enter a valid amount");
      return;
    }
    const { data, error } = await supabase
      .from('billing')
      .insert([
        {
          patient_id: selectedPatient,
          amount: amt,
          status: 'unpaid',
        },
      ])
      .select();
    if (error) {
      alert('Error creating bill: ' + error.message);
      return;
    }
    if (data && data.length > 0) {
      const newBill = data[0];
      setBills([
        {
          id: newBill.billing_id,
          patient: newBill.patient_id,
          amount: newBill.amount,
          date: newBill.date_issued,
          paid: newBill.status === 'paid',
        },
        ...bills,
      ]);
      setAmount("");
      if (amountInputRef.current) amountInputRef.current.value = "";
    }
  };

  const markBillAsPaid = async (id: string) => {
    const { error } = await supabase
      .from('billing')
      .update({ status: 'paid' })
      .eq('billing_id', id);
    if (error) {
      alert('Error marking bill as paid: ' + error.message);
      return;
    }
    setBills((prev) =>
      prev.map((bill) => (bill.id === id ? { ...bill, paid: true } : bill))
    );
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="topbar">
          <h1>Billing</h1>
          <Image src="/icons/profile.png" alt="Profile" width={40} height={40} className="profile-pic" />
        </header>
        <div className="billing-content">
          <div className="top-section">
            <div className="create-bill-card">
              <h3>Create Bill</h3>
              <div className="form-group">
                <label htmlFor="patientSelect">Patient Name</label>
                <div className="select-wrapper">
                  <select
                    id="patientSelect"
                    ref={patientSelectRef}
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                  >
                    <option value="">Select a patient</option>
                    <option value="Carlos Agasin (ID: 01)">Carlos Agasin (ID: 01)</option>
                    <option value="Maria Santos (ID: 02)">Maria Santos (ID: 02)</option>
                    <option value="Juan Dela Cruz (ID: 03)">Juan Dela Cruz (ID: 03)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="amountInput">Amount</label>
                <input
                  type="number"
                  id="amountInput"
                  ref={amountInputRef}
                  placeholder="0.00"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateBill();
                  }}
                />
              </div>
              <button className="create-bill-btn" onClick={handleCreateBill}>
                Create Bill
              </button>
            </div>
            <div className="recent-bills-card">
              <h3>Recent Bills</h3>
              <div className="bills-list">
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : bills.length === 0 ? (
                  <div>No bills found.</div>
                ) : (
                  bills.map((bill) => (
                    <div className="bill-item" key={bill.id}>
                      <div className="bill-info">
                        <div className="bill-id">ID: {bill.id}</div>
                        <div className="bill-amount">₱ {bill.amount}</div>
                        <div className="bill-date">{bill.date}</div>
                      </div>
                      <div className="bill-actions">
                        <span className={`status ${bill.paid ? "paid" : "unpaid"}`}>
                          {bill.paid ? "Paid" : "Unpaid"}
                        </span>
                        {!bill.paid && (
                          <button
                            className="mark-paid-btn"
                            onClick={() => markBillAsPaid(bill.id)}
                          >
                            Mark Paid
                          </button>
                        )}
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(bill.id)}
                          disabled={deleting === bill.id}
                        >
                          {deleting === bill.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
