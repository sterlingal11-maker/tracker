import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

class RootBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, info: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { this.setState({ info }); console.error("ROOT CRASH:", e, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: "monospace", background: "#1a0000", color: "#ff6b6b", minHeight: "100vh", overflow: "auto" }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>⚠️ App Crash — Please share this error</div>
          <div style={{ background: "#2a0000", padding: 16, borderRadius: 8, marginBottom: 12, fontSize: 14, color: "#ffaaaa" }}>
            <strong>Error:</strong> {String(this.state.error)}
          </div>
          {this.state.info && (
            <pre style={{ background: "#111", padding: 16, borderRadius: 8, fontSize: 11, overflowX: "auto", whiteSpace: "pre-wrap", color: "#ffcc88" }}>
              {this.state.info.componentStack}
            </pre>
          )}
          <button onClick={() => { this.setState({ error: null, info: null }); window.location.reload(); }}
            style={{ marginTop: 16, padding: "10px 24px", background: "#e8c547", color: "#000", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            🔄 Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <RootBoundary>
    <App />
  </RootBoundary>
);
