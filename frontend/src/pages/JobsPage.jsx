import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState(null);
  const [stress, setStress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.jobs(), api.householdStress()])
      .then(([jobsRes, stressRes]) => {
        setJobs(jobsRes);
        setStress(stressRes);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!jobs || !stress) return <p className="muted">Loading jobs data...</p>;

  return (
    <section className="page">
      <h1>Job Market Simplifier (PLFS-Based Tool)</h1>

      <div className="panel">
        <h2>Headline Simplified</h2>
        <p><strong>Unemployment:</strong> {jobs.headline.unemployment}%</p>
        <p><strong>Youth unemployment:</strong> {jobs.headline.youth_unemployment}%</p>
        <p><strong>Job Quality:</strong> {jobs.headline.job_quality}</p>
      </div>

      <div className="panel">
        <h2>Urban vs Rural Comparison</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Urban</th>
              <th>Rural</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Unemployment</td>
              <td>{jobs.urban_vs_rural.unemployment.urban}%</td>
              <td>{jobs.urban_vs_rural.unemployment.rural}%</td>
              <td>{jobs.urban_vs_rural.unemployment.meaning}</td>
            </tr>
            <tr>
              <td>Female LFPR (2023-24)</td>
              <td>{jobs.urban_vs_rural.female_lfpr.urban_2023_24}%</td>
              <td>{jobs.urban_vs_rural.female_lfpr.rural_2023_24}%</td>
              <td>{jobs.urban_vs_rural.female_lfpr.meaning}</td>
            </tr>
            <tr>
              <td>Self-employment Share</td>
              <td>{jobs.urban_vs_rural.self_employment_share.urban}%</td>
              <td>{jobs.urban_vs_rural.self_employment_share.rural}%</td>
              <td>{jobs.urban_vs_rural.self_employment_share.meaning}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Job Quality Indicator</h2>
        <p><strong>Regular salaried share:</strong> {jobs.job_quality.regular_salaried_share}%</p>
        <p><strong>Self-employment share:</strong> {jobs.job_quality.self_employed_share}%</p>
        <p><strong>Job Security Index:</strong> {jobs.job_quality.job_security_index}/10</p>
      </div>

      <div className="panel">
        <h2>Interpretation Logic</h2>
        <ul>
          {jobs.interpretations.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <div className="panel">
        <h2>Household Stress Dashboard (Combined Signal)</h2>
        <p><strong>Stress level:</strong> {stress.stress_level}</p>
        <p>{stress.narrative}</p>
      </div>
    </section>
  );
}
