export default function RootLoading() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ position: "relative", width: 48, height: 48 }}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width={48} height={48}>
          <rect width="32" height="32" rx="7" fill="#0a0a0a"/>
          <rect width="32" height="32" rx="7" fill="none" stroke="#00ff88" strokeWidth="1" strokeOpacity="0.4"/>
          <polyline points="7,10 4,16 7,22" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="25,10 28,16 25,22" stroke="#ffb800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="16" x2="20" y2="16" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="22" cy="16" r="1.5" fill="#00ff88"/>
        </svg>
        <div style={{
          position: "absolute",
          inset: -6,
          borderRadius: "50%",
          border: "2px solid transparent",
          borderTopColor: "#00ff88",
          animation: "spin 0.9s linear infinite",
        }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
