import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/unbounded/800.css";
import "@fontsource/unbounded/900.css";
import "./styles.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
