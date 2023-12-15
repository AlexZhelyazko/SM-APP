import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/authContext";
import { QueryClient, QueryClientProvider } from "react-query";

const container = document.getElementById("root")!;
const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DarkModeContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </DarkModeContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
