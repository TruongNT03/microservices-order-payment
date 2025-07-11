import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryCient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryCient}>
    <App />
  </QueryClientProvider>
);
