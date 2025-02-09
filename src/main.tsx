import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
  </React.StrictMode>
);
