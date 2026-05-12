import { useState } from "react";
import axios from "axios";

const fields = [
  { name: "study_hours", label: "Study hours / day", icon: "📖", placeholder: "e.g. 4", step: "0.5" },
  { name: "attendance", label: "Attendance (%)", icon: "📅", placeholder: "e.g. 85" },
  { name: "previous_marks", label: "Previous marks", icon: "📊", placeholder: "e.g. 72" },
  { name: "sleep_hours", label: "Sleep hours / day", icon: "🌙", placeholder: "e.g. 7", step: "0.5" },
];

function getGrade(marks) {
  if (marks >= 90) return { label: "A+", color: "#27500A", bg: "#EAF3DE" };
  if (marks >= 75) return { label: "A",  color: "#27500A", bg: "#EAF3DE" };
  if (marks >= 60) return { label: "B",  color: "#0C447C", bg: "#E6F1FB" };
  if (marks >= 45) return { label: "C",  color: "#633806", bg: "#FAEEDA" };
  return                    { label: "F",  color: "#791F1F", bg: "#FCEBEB" };
}

export default function App() {
  const [form, setForm] = useState({
    study_hours: "", attendance: "", previous_marks: "", sleep_hours: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (Object.values(form).some((v) => v === "")) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.post("http://localhost:5000/check", form);
      setResult(Math.round(res.data.predicted_marks));
    } catch {
      setError("Could not connect to server at localhost:5000.");
    } finally {
      setLoading(false);
    }
  };

  const grade = result !== null ? getGrade(result) : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f5f4f0", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: 480, background: "#fff", borderRadius: 16,
        border: "0.5px solid #e0dfd8", padding: "2rem" }}>

        <h1 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 4px" }}>
          🎓 Marks predictor
        </h1>
        <p style={{ fontSize: 14, color: "#888", margin: "0 0 1.5rem" }}>
          Enter your study details to predict your exam score
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {fields.map(({ name, label, placeholder, step }) => (
            <div key={name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>{label}</label>
              <input
                type="number" name={name} value={form[name]}
                placeholder={placeholder} step={step || "1"}
                onChange={handleChange}
                style={{ padding: "8px 10px", borderRadius: 8,
                  border: "0.5px solid #d0cfc8", fontSize: 14, outline: "none" }}
              />
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={loading}
          style={{ width: "100%", padding: "10px", fontSize: 15, fontWeight: 500,
            borderRadius: 8, border: "0.5px solid #d0cfc8", background: "#fff",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Predicting…" : "✨ Predict marks"}
        </button>

        {result !== null && (
          <div style={{ marginTop: 16, padding: "1rem 1.25rem", background: "#f5f4f0",
            borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#888" }}>Predicted score</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 28, fontWeight: 500 }}>{result}</span>
                <span style={{ fontSize: 14, color: "#888" }}>/ 100</span>
              </div>
            </div>
            <div style={{ padding: "6px 14px", borderRadius: 8,
              background: grade.bg, color: grade.color, fontWeight: 500, fontSize: 13 }}>
              {grade.label}
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop: 16, padding: "10px 14px", background: "#FCEBEB",
            borderRadius: 8, fontSize: 13, color: "#791F1F" }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}