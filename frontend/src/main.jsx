import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";
import CategoryProvider from "./context/CategoryContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <CategoryProvider>
                <App />
            </CategoryProvider>
        </AuthProvider>
    </StrictMode>,
);
