export default function BuildLoading() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
    }}>
      {/* Animated logo */}
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48}>
          <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
          <rect width="32" height="32" rx="7" fill="none" stroke="#00ff88" strokeWidth="1" strokeOpacity="0.4"/>
          <polyline points="7,10 4,16 7,22" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="25,10 28,16 25,22" stroke="#ffb800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="16" x2="20" y2="16" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="22" cy="16" r="1.5" fill="#00ff88"/>
        </svg>
        {/* Spinning ring */}
        <div style={{
          position: "absolute",
          inset: -6,
          borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "#00ff88",
          borderRightColor: "rgba(0,255,136,0.2)",
          animation: "spin 0.9s linear infinite",
        }} />
      </div>

      {/* Label */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        letterSpacing: "0.08em",
      }}>
        Loading builder<span style={{ animation: "blink 1s step-end infinite" }}>_</span>
      </div>

      {/* Progress bar */}
      <div style={{
        width: 160,
        height: 2,
        background: "var(--border)",
        borderRadius: 2,
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          background: "linear-gradient(90deg, #00ff88, #ffb800)",
          borderRadius: 2,
          animation: "progress 1.2s ease-in-out infinite",
        }} />
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
