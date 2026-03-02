import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.home()
      .then((data) => setSuggestions(data.suggestions || []))
      .catch((err) => setError(err.message));
  }, []);

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.ask(question.trim());
      setAnswer(res.answer || "No answer generated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <h1>Ask MoSPI Assistant</h1>
      <p className="muted">
        Ask questions in plain English. Powered by MoSPI data via MCP-backed snapshot ingestion.
      </p>

      <div className="panel">
        <textarea
          className="input-textarea"
          rows={5}
          placeholder="Example: Is inflation likely to hurt my monthly grocery budget?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="actions-row">
          <button className="btn" type="button" onClick={ask} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {answer && (
        <div className="panel">
          <h2>Answer</h2>
          <p className="answer-text">{answer}</p>
        </div>
      )}

      <div className="panel">
        <h2>Try these questions</h2>
        <div className="chip-wrap">
          {suggestions.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => setQuestion(s)}>{s}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
