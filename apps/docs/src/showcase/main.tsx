import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@praabindh/aura-design-system/styles.css";
import { App } from "./App";
import styles from "./showcase.module.css";

if (styles.document) document.body.classList.add(styles.document);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
