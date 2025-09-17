
"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../../public/CSS/dashy.css";
import "../../../public/CSS/wristbands.css";

interface Wristband {
  id: string;
  rfid: string;
  status: "Active" | "Inactive";
  battery: number;
  patientId: string;
}

const initialWristbands: Wristband[] = [
  { id: "WB002", rfid: "WB001", status: "Active", battery: 80, patientId: "02" },
];

export default function Wristbands() {
  "use client";
  const [search, setSearch] = useState("");
  const [wristbands, setWristbands] = useState(initialWristbands);
  const [deleting, setDeleting] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this wristband?')) return;
    setDeleting(id);
    const { error } = await supabase
      .from('wristband')
      .delete()
      .eq('wristband_id', id);
    setDeleting(null);
    if (error) {
      alert('Error deleting wristband: ' + error.message);
      return;
    }
    setWristbands((prev) => prev.filter((w) => w.id !== id));
  };

  // Filter wristbands by search
  const filteredWristbands = wristbands.filter((wb) => {
    const text = `${wb.id} ${wb.rfid} ${wb.status} ${wb.patientId}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  // Battery indicator class
  function getBatteryClass(battery: number) {
    if (battery >= 70) return "high";
    if (battery >= 30) return "mid";
    return "low";
  }

  return (
    <div className="dashboard">
      <main className="main-content">
        <header className="topbar">
          <div className="search-container">
            <div className="search">
              <span role="img" aria-label="search">🔍</span>
              <input
                type="text"
                placeholder="Search patient, wristband, ID"
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="action-buttons">
              <button className="btn btn-register">Register</button>
            </div>
          </div>
          <Image src="/icons/profile.png" alt="Profile" width={40} height={40} className="profile-pic" />
        </header>
        <h1 className="page-title">Wristbands</h1>
        <div className="wristbands-card">
          <table className="wristbands-table">
            <thead>
              <tr>
                <th>WristbandID</th>
                <th>RFID</th>
                <th>Status</th>
                <th>Battery</th>
                <th>Patient ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredWristbands.map((wb) => (
                <tr key={wb.id}>
                  <td>{wb.id}</td>
                  <td>{wb.rfid}</td>
                  <td>
                    <span className={`status ${wb.status === "Active" ? "active" : "inactive"}`}>{wb.status}</span>
                  </td>
                  <td>
                    <div className="battery">
                      <div className="battery-bar">
                        <div
                          className={`battery-fill ${getBatteryClass(wb.battery)} w-4/5 battery-fill-${wb.battery}`}
                        ></div>
                      </div>
                      {wb.battery}%
                    </div>
                  </td>
                  <td>{wb.patientId}</td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(wb.id)}
                      disabled={deleting === wb.id}
                    >
                      {deleting === wb.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
