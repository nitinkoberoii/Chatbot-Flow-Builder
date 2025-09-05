import React from "react";
import Routes from "./Routes";

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <div style={{ padding: '20px', color: '#1e293b', fontSize: '18px' }}>
        <h1>Chatbot Flow Builder</h1>
        <p>Loading application...</p>
      </div>
      <Routes />
    </div>
  );
}

export default App;
