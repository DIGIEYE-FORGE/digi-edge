import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { ThemeProvider } from "@material-tailwind/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider
      value={{
        button: {
          defaultProps: {
            size: "sm",
            variant: "gradient",
          },
        },
        input: {
          defaultProps: {
            size: "sm",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
