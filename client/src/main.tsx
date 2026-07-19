import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/theme-provider.tsx";
import { Toaster } from "sonner"; // if sooner don't work import from components
import { UserProvider } from "./context/user-provider.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchInterval: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {/* <BrowserRouter basename="chat-hive"> */}
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" richColors />
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  </StrictMode>,
);
