import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";
import { TokenProvider } from "./modules/auth/context/token";
import App from "./modules/app";
import "./tailwind.css";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <TokenProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </TokenProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
