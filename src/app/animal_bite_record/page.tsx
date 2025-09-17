
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import "../../../public/CSS/bite_record.css";

export default function AnimalBiteRecord() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: "N/A",
    name: "N/A",
    contact: "N/A",
    address: "N/A",
    wristband: "N/A",
    date: "N/A",
  });
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const handleDelete = async (patientId: string) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    setDeleting(patientId);
    const { error } = await supabase
      .from('patient')
      .delete()
      .eq('patient_id', patientId);
    setDeleting(null);
    if (error) {
      alert('Error deleting patient: ' + error.message);
      return;
    }
    setPatients((prev) => prev.filter((p) => p.patient_id !== patientId));
  };
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('patient')
        .select('patient_id, name, contact_no, address, wristband_id, date_registered');
      if (error) {
        setError(error.message);
      } else {
        setPatients(data || []);
      }
      setLoading(false);
    };
    fetchPatients();
  }, []);

  const handleView = (row: any) => {
    setModalData({
      id: row.patient_id || "N/A",
      name: row.name || "N/A",
      contact: row.contact_no || "N/A",
      address: row.address || "N/A",
      wristband: row.wristband_id || "N/A",
      date: row.date_registered || "N/A",
    });
    setShowModal(true);
  };

  return (
    <div id="biteRecordPage" className="page">
      <header className="topbar">
        <h1>Records</h1>
        <Image src="/icons/profile.png" alt="Profile" width={40} height={40} className="profile-pic" />
      </header>
      <div className="search-bar">
        <div className="search-container">
          <input type="text" placeholder="Search patient, wristband, ID" className="search-input" />
          <span className="search-icon">🔍</span>
        </div>
        <button className="btn btn-register" onClick={() => router.push("/register")}>Register</button>
      </div>
      <section className="records-section">
        <div className="records-container">
          <h2>Records</h2>
          <table className="records-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact No.</th>
                <th>Address</th>
                <th>Wristband ID</th>
                <th>Date Registered</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7}>Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="error-message">{error}</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan={7}>No records found.</td></tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.patient_id}>
                    <td>{patient.patient_id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.contact_no}</td>
                    <td>{patient.address}</td>
                    <td>{patient.wristband_id}</td>
                    <td>{patient.date_registered}</td>
                    <td>
                      <button className="btn btn-view" onClick={() => handleView(patient)}>View</button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(patient.patient_id)}
                        disabled={deleting === patient.patient_id}
                      >
                        {deleting === patient.patient_id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      {showModal && (
        <div className="modal modal-flex" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Patient Details</h3>
            <p>ID: {modalData.id}</p>
            <p>Name: {modalData.name}</p>
            <p>Contact: {modalData.contact}</p>
            <p>Address: {modalData.address}</p>
            <p>Wristband: {modalData.wristband}</p>
            <p>Date Registered: {modalData.date}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
