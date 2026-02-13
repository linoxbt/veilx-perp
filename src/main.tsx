import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force clean rebuild after dependency changes
createRoot(document.getElementById("root")!).render(<App />);
