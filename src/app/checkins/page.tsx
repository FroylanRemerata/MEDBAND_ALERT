
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../../public/CSS/checkins.css";

interface Checkin {
  checkin_id: string;
  patient_id: string;
  checkin_time: string;
}

export default function Checkins() {
  const [showModal, setShowModal] = useState(false);
  const [recentCheckins, setRecentCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const fetchCheckins = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('checkin')
        .select('checkin_id, patient_id, checkin_time')
        .order('checkin_time', { ascending: false })
        .limit(5);
      if (error) {
        setError(error.message);
      } else {
        setRecentCheckins((data as Checkin[]) || []);
      }
      setLoading(false);
    };
    fetchCheckins();
  }, []);

  const handleScan = async () => {
    setShowModal(true);
    setScanning(true);
    // Simulate scan and add a check-in (for demo, use a static patient_id)
    setTimeout(async () => {
      const patientId = prompt('Enter Patient ID to check in:');
      if (!patientId) {
        setScanning(false);
        return;
      }
      const { data, error } = await supabase
        .from('checkin')
        .insert([{ patient_id: patientId }])
        .select();
      if (error) {
        alert('Error during check-in: ' + error.message);
      } else if (data && data.length > 0) {
        setRecentCheckins((prev) => [data[0] as Checkin, ...prev.slice(0, 4)]);
      }
      setScanning(false);
    }, 1000);
  };

  return (
    <main className="main-content">
      <div className="checkins-wrapper">
        <header className="topbar">
          <h1 className="checkin-header">Check–in RFID</h1>
          <Image src="/icons/profile.png" alt="Profile" width={40} height={40} className="profile-pic" />
        </header>
        <div className="checkins-flex">
          <div className="card">
            <div className="desc">Scan wristband to mark attendance.</div>
            <div className="scan-area">
              <Image src="/icons/scanning.png" alt="Scanning Area" width={80} height={80} />
            </div>
            <div className="scan-btn-container">
              <button className="scan-btn" onClick={handleScan} disabled={scanning}>
                {scanning ? 'Scanning...' : 'Scan'}
              </button>
            </div>
          </div>
          <div className="card card-recent">
            <div className="recent-checkin">Recent Check-in</div>
            <div className="recent-list">
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : recentCheckins.length === 0 ? (
                <div>No recent check-ins.</div>
              ) : (
                recentCheckins.map((checkin) => (
                  <div key={checkin.checkin_id} className="recent-checkin-item">
                    Patient ID: {checkin.patient_id} <br />
                    Time: {new Date(checkin.checkin_time).toLocaleString()}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {showModal && (
          <div
            className="scan-modal scan-modal-flex"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div className="scan-modal-content">Please scan the wristband.....</div>
          </div>
        )}
      </div>
    </main>
  );
}
