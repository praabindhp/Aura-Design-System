import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@praabindh/aura-design-system/styles.css";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root");

if (!root) throw new Error("The consumer fixture root element is missing.");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
