import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux";
import { BrowserRouter } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import 'react-loading-skeleton/dist/skeleton.css';
import { Toaster } from "@/components/ui/sonner"
import { LoadingProvider } from "./LoadingContext.tsx";
import Loading from "./components/common/Loading.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LoadingProvider>
          <BrowserRouter>
            <Loading />
            <Toaster richColors position="top-center"/>
            <App />
          </BrowserRouter>
        </LoadingProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
