
import Image from "next/image";
import { Metadata } from "next";
import "../../../public/CSS/emergency.css";

export const metadata: Metadata = {
  title: "Emergency Protocols | Animal Bite Clinic",
  description: "Emergency protocols and rabies exposure management at the Animal Bite Clinic.",
  openGraph: {
    title: "Emergency Protocols | Animal Bite Clinic",
    description: "Emergency protocols and rabies exposure management at the Animal Bite Clinic.",
    type: "website",
  },
};

export default function Emergency() {
  "use client";
  return (
    <div className="emergency-page">
      <div className="header">
        <h2 className="emergency-title">Emergency Protocols</h2>
        <Image src="/icons/profile.png" alt="Profile" width={40} height={40} className="profile-pic" />
      </div>
      <div className="grid">
        <div className="card">
          <h3>DOH Bite Classification</h3>
          <ul>
            <li><strong>Category I:</strong> Touching or feeding animals, or licks on intact skin (No treatment needed).</li>
            <li><strong>Category II:</strong> Nibbling on uncovered skin or minor scratches (Requires immediate vaccination).</li>
            <li><strong>Category III:</strong> Deep bites/scratches or licks on broken skin (Requires immediate vaccination + Rabies Immunoglobulin [RIG]).</li>
          </ul>
        </div>
        <div className="card">
          <h3>Wound Care Procedure</h3>
          <ul>
            <li>Clean the wound right away with soap and running water for at least 15 minutes.</li>
            <li>Apply an antiseptic solution (such as povidone-iodine or alcohol).</li>
            <li>Do not cover the wound too tightly and avoid using traditional remedies.</li>
            <li>Visit a clinic promptly for vaccination.</li>
          </ul>
        </div>
        <div className="card">
          <h3>Rabies Exposure Management</h3>
          <ul>
            <li>Determine the bite category.</li>
            <li>Give the rabies vaccine (and Rabies Immunoglobulin [RIG] if Category III).</li>
            <li>Observe the biting animal for 14 days, if possible.</li>
            <li>Report the case to the local health unit.</li>
          </ul>
        </div>
        <div className="card">
          <h3>Prevention & Awareness Tips</h3>
          <ul>
            <li>Educate family members, especially children, about the risks of rabies.</li>
            <li>Avoid provoking or playing roughly with animals.</li>
            <li>Ensure pets are regularly vaccinated against rabies.</li>
            <li>Report stray or aggressive animals to local authorities.</li>
            <li>Promote community awareness on proper rabies prevention and control.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
