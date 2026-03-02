import { useState } from "react";
import HomePage from "./pages/HomePage";
import InflationPage from "./pages/InflationPage";
import JobsPage from "./pages/JobsPage";
import "./styles/app.css";

const tabs = [
  { id: "home", label: "MoSPI Assistant" },
  { id: "inflation", label: "Inflation Decoder" },
  { id: "jobs", label: "Job Market Simplifier" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <main className="app-layout">
      <aside className="sidebar">
        <h2>Gov Data Insights</h2>
        <nav>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-btn ${activeTab === tab.id ? "active" : ""}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <p className="powered-note">Powered by MoSPI data via MCP-backed ingestion</p>
      </aside>

      <section className="content">
        {activeTab === "home" && <HomePage />}
        {activeTab === "inflation" && <InflationPage />}
        {activeTab === "jobs" && <JobsPage />}
      </section>
    </main>
  );
}
