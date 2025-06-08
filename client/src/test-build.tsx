import { createRoot } from "react-dom/client";

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>CUCA Beer - Teste Netlify</h1>
      <p>Se você está vendo esta página, o build básico funciona!</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <strong>Status:</strong> Build funcionando ✓
      </div>
    </div>
  );
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<TestApp />);
}