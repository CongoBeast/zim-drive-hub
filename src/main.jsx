import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Bootstrap CSS (ensure bootstrap is installed: npm install bootstrap)
import "bootstrap/dist/css/bootstrap.min.css";

// ZimDriveHub global styles & theme variables
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);