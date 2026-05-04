import { useState, useRef, useCallback } from "react";

// const API_URL = "http://localhost:8000";
const API_URL = "https://capillary-mammal-sandbag.ngrok-free.dev";
const DISEASE_INFO = {
  Potato___Early_blight: {
    label: "Early Blight",
    color: "#B85C00",
    bg: "#FFF4E6",
    border: "#E8831A",
    icon: "⚠",
    description:
      "Caused by Alternaria solani fungus. Characterized by dark brown spots with concentric rings forming a 'target' pattern on older leaves.",
    treatment:
      "Apply fungicides containing chlorothalonil or mancozeb. Remove infected leaves and avoid overhead watering.",
    severity: "Moderate",
  },
  Potato___Late_blight: {
    label: "Late Blight",
    color: "#8B1A1A",
    bg: "#FFF0F0",
    border: "#D94040",
    icon: "✕",
    description:
      "Caused by Phytophthora infestans, the pathogen responsible for the Irish potato famine. Creates water-soaked lesions that turn brown-black.",
    treatment:
      "Apply copper-based or systemic fungicides immediately. Destroy infected plants. Improve drainage and air circulation.",
    severity: "Severe",
  },
  Potato___healthy: {
    label: "Healthy",
    color: "#1A6B2F",
    bg: "#F0FFF4",
    border: "#34A853",
    icon: "✓",
    description:
      "Your potato plant shows no signs of disease. The leaves appear vibrant with no visible lesions, spots, or discoloration.",
    treatment: "Continue regular care — adequate watering, fertilization, and periodic inspection.",
    severity: "None",
  },
};

export default function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    setError(null);
    setResult(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to connect to the prediction server. Make sure your FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const diseaseKey = result?.class;
  const info = diseaseKey ? DISEASE_INFO[diseaseKey] : null;
  const confidence = result?.confidence !== undefined
  ? Math.round(result.confidence * 100)
  : null;
  console.log("Backend result:", result);
  console.log("Disease Key:", diseaseKey);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <header style={{ background: "#1C3A1C", padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#4A8C4A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          🥔
        </div>
        <div>
          <h1 style={{ margin: 0, color: "#E8F5E8", fontSize: 20, fontWeight: "normal", letterSpacing: "0.04em" }}>
            Potato Disease Detector
          </h1>
          <p style={{ margin: 0, color: "#7DAF7D", fontSize: 13, fontFamily: "sans-serif" }}>
            AI-powered plant health analysis
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Upload zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !preview && fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#4A8C4A" : "#C5BFB0"}`,
            borderRadius: 16,
            background: dragging ? "#F0FAF0" : preview ? "#fff" : "#FDFCFA",
            minHeight: preview ? "auto" : 220,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: preview ? "default" : "pointer",
            transition: "all 0.2s",
            overflow: "hidden",
            padding: preview ? 0 : "2rem",
            position: "relative",
          }}
        >
          {preview ? (
            <div style={{ width: "100%", position: "relative" }}>
              <img
                src={preview}
                alt="Uploaded potato leaf"
                style={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block", borderRadius: 14 }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: "rgba(0,0,0,0.55)", color: "#fff", border: "none",
                  borderRadius: "50%", width: 32, height: 32, cursor: "pointer",
                  fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🍃</div>
              <p style={{ margin: 0, fontSize: 16, color: "#5A5040", textAlign: "center" }}>
                Drop a potato leaf image here
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9A8F80", fontFamily: "sans-serif", textAlign: "center" }}>
                or click to browse — JPG, PNG, WEBP supported
              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {/* Action buttons */}
        {preview && (
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 10, border: "none",
                background: loading ? "#8BAD8B" : "#2D6A2D", color: "#fff",
                fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Georgia', serif", letterSpacing: "0.02em",
                transition: "background 0.2s",
              }}
            >
              {loading ? "Analyzing…" : "Analyze Leaf"}
            </button>
            <button
              onClick={reset}
              style={{
                padding: "14px 20px", borderRadius: 10, border: "1.5px solid #C5BFB0",
                background: "transparent", color: "#5A5040", fontSize: 15,
                cursor: "pointer", fontFamily: "sans-serif",
              }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 20, padding: "14px 18px", borderRadius: 10,
            background: "#FFF0F0", border: "1px solid #F4AAAA", color: "#8B1A1A",
            fontSize: 14, fontFamily: "sans-serif",
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Result card */}
        {result && info && (
          <div style={{
            marginTop: 24, borderRadius: 16, border: `1.5px solid ${info.border}`,
            background: info.bg, overflow: "hidden",
            animation: "fadeIn 0.4s ease",
          }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>

            {/* Result header */}
            <div style={{
              padding: "18px 22px", display: "flex", alignItems: "center",
              gap: 14, borderBottom: `1px solid ${info.border}`,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: info.color, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: "bold", flexShrink: 0,
              }}>
                {info.icon}
              </div>
              <div>
                <h2 style={{ margin: 0, color: info.color, fontSize: 20, fontWeight: "normal" }}>
                  {info.label}
                </h2>
                <p style={{ margin: 0, fontSize: 13, color: "#6B6060", fontFamily: "sans-serif" }}>
                  Severity: <strong>{info.severity}</strong>
                </p>
              </div>

              {/* Confidence bar */}
              <div style={{ marginLeft: "auto", textAlign: "right", minWidth: 100 }}>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#6B6060", fontFamily: "sans-serif" }}>
                  Confidence
                </p>
                <div style={{ height: 6, background: "#E0DAD0", borderRadius: 99, width: 100 }}>
                  <div style={{
                    height: "100%", width: `${confidence}%`,
                    background: info.color, borderRadius: 99,
                    transition: "width 0.8s ease",
                  }} />
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: info.color, fontFamily: "sans-serif", fontWeight: 600 }}>
                  {confidence}%
                </p>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: "18px 22px", display: "grid", gap: 16 }}>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 13, color: "#7A7060", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Diagnosis
                </h3>
                <p style={{ margin: 0, fontSize: 15, color: "#2A2020", lineHeight: 1.6 }}>
                  {info.description}
                </p>
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 13, color: "#7A7060", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  Recommended Action
                </h3>
                <p style={{ margin: 0, fontSize: 15, color: "#2A2020", lineHeight: 1.6 }}>
                  {info.treatment}
                </p>
              </div>

              {/* All class probabilities if available */}
              {result.all_predictions && (
                <div>
                  <h3 style={{ margin: "0 0 10px", fontSize: 13, color: "#7A7060", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                    All Probabilities
                  </h3>
                  {Object.entries(result.all_predictions).map(([cls, prob]) => {
                    const d = DISEASE_INFO[cls];
                    const pct = Math.round(prob * 100);
                    return (
                      <div key={cls} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontFamily: "sans-serif", color: "#5A5040", width: 120, flexShrink: 0 }}>
                          {d?.label || cls}
                        </span>
                        <div style={{ flex: 1, height: 5, background: "#E0DAD0", borderRadius: 99 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: d?.color || "#888", borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 13, fontFamily: "sans-serif", color: d?.color, fontWeight: 600, minWidth: 36, textAlign: "right" }}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tip */}
        {!preview && !result && (
          <p style={{ textAlign: "center", color: "#9A8F80", fontSize: 13, marginTop: 20, fontFamily: "sans-serif" }}>
            For best results, use a clear close-up photo of a single potato leaf in natural light.
          </p>
        )}
      </main>
    </div>
  );
}