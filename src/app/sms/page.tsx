

"use client";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../../public/CSS/dashy.css";
import "../../../public/CSS/sms.css";

interface Notification {
  id: string;
  patient: string;
  message: string;
  date: string;
}

export default function SMS() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    setDeleting(id);
    const { error } = await supabase
      .from('sms_notification')
      .delete()
      .eq('notification_id', id);
    setDeleting(null);
    if (error) {
      alert('Error deleting notification: ' + error.message);
      return;
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sms_notification')
        .select('notification_id, patient_id, message, date_sent')
        .order('date_sent', { ascending: false })
        .limit(10);
      if (error) {
        setError(error.message);
      } else {
        setNotifications(
          (data || []).map((n: any) => ({
            id: n.notification_id,
            patient: n.patient_id,
            message: n.message,
            date: n.date_sent ? n.date_sent.slice(0, 10) : '',
          }))
        );
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const handleSend = async () => {
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }
    if (!customMessage.trim()) {
      alert("Please enter a message");
      return;
    }
    setSending(true);
    const { data, error } = await supabase
      .from('sms_notification')
      .insert([
        {
          patient_id: selectedPatient,
          message: customMessage,
        },
      ])
      .select();
    setSending(false);
    if (error) {
      alert('Error sending notification: ' + error.message);
      return;
    }
    if (data && data.length > 0) {
      setNotifications([
        {
          id: data[0].notification_id,
          patient: data[0].patient_id,
          message: data[0].message,
          date: data[0].date_sent ? data[0].date_sent.slice(0, 10) : '',
        },
        ...notifications,
      ]);
      setCustomMessage("");
      if (messageInputRef.current) messageInputRef.current.value = "";
    }
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="topbar">
          <h1>Notification/Reminder</h1>
          <Image src="/icons/profile.png" alt="Profile" width={40} height={40} className="profile-pic" />
        </header>
        <div className="sms-content">
          <div className="notifications-container">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : notifications.length === 0 ? (
              <div>No notifications found.</div>
            ) : (
              notifications.map((n) => (
                <div className="notification-card" key={n.id}>
                  <div className="patient-id">To Patient ID: {n.patient}</div>
                  <div className="notification-message">{n.message}</div>
                  <div className="notification-date">{n.date}</div>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(n.id)}
                    disabled={deleting === n.id}
                  >
                    {deleting === n.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="send-notification-form">
            <label htmlFor="patient-select" className="block mb-1">Select Patient</label>
            <select
              id="patient-select"
              title="Select Patient"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">Select Patient</option>
              <option value="01">01</option>
              <option value="02">02</option>
              <option value="04">04</option>
              <option value="06">06</option>
            </select>
            <textarea
              ref={messageInputRef}
              placeholder="Enter your message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.ctrlKey && e.key === "Enter") handleSend();
              }}
            />
            <button
              className="send-notification-btn"
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
