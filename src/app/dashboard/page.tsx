
"use client";
import Image from "next/image";
import { useEffect, useRef, useState, MutableRefObject } from "react";
import { supabase } from "../../lib/supabaseClient";
import "../../../public/CSS/dashy.css";
import type { Chart } from "chart.js";



export default function Dashboard() {
  const [totalPatients, setTotalPatients] = useState<number | null>(null);
  const [activeWristbands, setActiveWristbands] = useState<number | null>(null);
  const [checkinsToday, setCheckinsToday] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Chart.js refs with correct type
  const bitesChartRef = useRef<Chart | null>(null);
  const vaccineChartRef = useRef<Chart | null>(null);
  const wristbandChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Total patients
        const { count: patientCount, error: patientError } = await supabase
          .from('patient')
          .select('*', { count: 'exact', head: true });
        if (patientError) throw patientError;
        setTotalPatients(patientCount || 0);

        // Active wristbands
        const { count: wristbandCount, error: wristbandError } = await supabase
          .from('wristband')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Active');
        if (wristbandError) throw wristbandError;
        setActiveWristbands(wristbandCount || 0);

        // Today's check-ins
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const startOfDay = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
        const endOfDay = `${yyyy}-${mm}-${dd}T23:59:59.999Z`;
        const { count: checkinCount, error: checkinError } = await supabase
          .from('checkin')
          .select('*', { count: 'exact', head: true })
          .gte('checkin_time', startOfDay)
          .lte('checkin_time', endOfDay);
        if (checkinError) throw checkinError;
        setCheckinsToday(checkinCount || 0);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'Error loading dashboard stats');
        } else {
          setError('Error loading dashboard stats');
        }
      }
      setLoading(false);
    };
    fetchStats();

    let isMounted = true;
    async function initializeCharts() {
      const Chart = (await import("chart.js/auto")).default;

      // Destroy previous chart instances if they exist
      if (bitesChartRef.current) {
        bitesChartRef.current.destroy();
        bitesChartRef.current = null;
      }
      if (vaccineChartRef.current) {
        vaccineChartRef.current.destroy();
        vaccineChartRef.current = null;
      }
      if (wristbandChartRef.current) {
        wristbandChartRef.current.destroy();
        wristbandChartRef.current = null;
      }

      // Bites Chart
      const bitesCtx = document.getElementById("bitesChart") as HTMLCanvasElement | null;
      if (bitesCtx && isMounted) {
        bitesChartRef.current = new Chart(bitesCtx, {
          type: "bar",
          data: {
            labels: ["April", "May", "June", "July", "August", "September", "October"],
            datasets: [
              {
                label: "Bites",
                data: [8, 12, 16, 20, 20, 25, 23],
                backgroundColor: [
                  "rgba(61,124,166,0.7)",
                  "rgba(61,124,166,0.8)",
                  "rgba(61,124,166,0.9)",
                  "rgba(61,124,166,1)",
                  "rgba(61,124,166,1)",
                  "rgba(61,124,166,1)",
                  "rgba(61,124,166,0.9)"
                ],
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 25, ticks: { stepSize: 5 } }
            }
          }
        });
      }
      // Vaccine Chart
      const vaccineCtx = document.getElementById("vaccineChart") as HTMLCanvasElement | null;
      if (vaccineCtx && isMounted) {
        vaccineChartRef.current = new Chart(vaccineCtx, {
          type: "line",
          data: {
            labels: ["April", "May", "June", "July", "August", "September", "October"],
            datasets: [
              {
                label: "Vaccines Used",
                data: [5, 7, 8, 10, 12, 13, 15],
                borderColor: "rgba(61,124,166,1)",
                backgroundColor: "rgba(61,124,166,0.2)",
                tension: 0.4,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 20, ticks: { stepSize: 5 } }
            }
          }
        });
      }
      // Wristband Chart
      const wristbandCtx = document.getElementById("wristbandChart") as HTMLCanvasElement | null;
      if (wristbandCtx && isMounted) {
        wristbandChartRef.current = new Chart(wristbandCtx, {
          type: "doughnut",
          data: {
            labels: ["Active", "Inactive"],
            datasets: [
              {
                label: "Wristbands",
                data: [10, 5],
                backgroundColor: [
                  "rgba(61,124,166,1)",
                  "rgba(200,200,200,0.7)"
                ],
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: "bottom" } }
          }
        });
      }
    }
    initializeCharts();
    return () => {
      isMounted = false;
      if (bitesChartRef.current) {
        bitesChartRef.current.destroy();
        bitesChartRef.current = null;
      }
      if (vaccineChartRef.current) {
        vaccineChartRef.current.destroy();
        vaccineChartRef.current = null;
      }
      if (wristbandChartRef.current) {
        wristbandChartRef.current.destroy();
        wristbandChartRef.current = null;
      }
    };
  }, []);

  return (
    <main className="main-content">
      <header className="topbar" aria-label="Dashboard Top Bar">
        <h1>DASHBOARD</h1>
        <Image src="/icons/profile.png" alt="Profile Picture" width={40} height={40} className="profile-pic" />
      </header>
      <section className="stats" aria-label="Dashboard Statistics">
        <div className="card">
          <h3>Total Patients</h3>
          <p className="number">{loading ? '...' : error ? <span className="error-message">Err</span> : totalPatients}</p>
          <span>Updated Today</span>
        </div>
        <div className="card">
          <h3>Active Wristbands</h3>
          <p className="number">{loading ? '...' : error ? <span className="error-message">Err</span> : activeWristbands}</p>
        </div>
        <div className="card">
          <h3>Check-ins Today</h3>
          <p className="number">{loading ? '...' : error ? <span className="error-message">Err</span> : checkinsToday}</p>
        </div>
      </section>
      <section className="charts-devices" aria-label="Charts and Connected Devices">
        <div className="charts">
          <div className="chart-box wide">
            <h3>Bites per Month</h3>
            <canvas id="bitesChart" aria-label="Bites per Month Chart" className="chart-canvas" />
          </div>
          <div className="chart-box">
            <h3>Vaccine Usage (recent)</h3>
            <canvas id="vaccineChart" aria-label="Vaccine Usage Chart" className="chart-canvas" />
          </div>
          <div className="chart-box">
            <h3>Wristband (active/inactive)</h3>
            <canvas id="wristbandChart" aria-label="Wristband Status Chart" className="chart-canvas" />
          </div>
        </div>
        <div className="devices">
          <h3>Connected Devices</h3>
          <p className="subtitle">Currently registered wristbands for monitoring.</p>
          <ul>
            <li>
              <span className="device-icon">📶</span>
              <span className="device-info">
                <span className="device-name">Patient Wristband 001</span>
                <span className="device-id">ID: 07</span>
              </span>
              <span className="status active">Assigned</span>
            </li>
            <li>
              <span className="device-icon">📶</span>
              <span className="device-info">
                <span className="device-name">Patient Wristband 002</span>
                <span className="device-id">ID: 06</span>
              </span>
              <span className="status inactive">Unassigned</span>
            </li>
            <li>
              <span className="device-icon">📶</span>
              <span className="device-info">
                <span className="device-name">Patient Wristband 003</span>
                <span className="device-id">ID: 03</span>
              </span>
              <span className="status active">Assigned</span>
            </li>
            <li>
              <span className="device-icon">📶</span>
              <span className="device-info">
                <span className="device-name">Patient Wristband 004</span>
                <span className="device-id">ID: 04</span>
              </span>
              <span className="status active">Assigned</span>
            </li>
            <li>
              <span className="device-icon">📶</span>
              <span className="device-info">
                <span className="device-name">Patient Wristband 005</span>
                <span className="device-id">ID: 05</span>
              </span>
              <span className="status active">Assigned</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
