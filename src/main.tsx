
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <Toaster
      position="top-center"
      richColors
      toastOptions={{
        style: {
          background: "#24191b",
          border: "1px solid #30292b",
          color: "#f8f8f8",
        },
      }}
    />
  </>
);
