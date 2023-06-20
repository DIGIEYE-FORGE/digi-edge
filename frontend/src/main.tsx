import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { ThemeProvider } from "@material-tailwind/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardPage from "./pages/main/dashboard";
import DevicesPage from "./pages/main/devices";
import FlowPage from "./pages/flow";
import App from "./App";
import MainPage from "./pages/main";
import GroupsPage from "./pages/main/groups";
import TenantsPage from "./pages/main/tenants";
import UsersPage from "./pages/main/users";
import NotFoundPage from "./pages/notfound";
import MqttServersPage from "./pages/main/mqtt-server";
import DeviceProfilePage from "./pages/main/device-profile";
import ProfilePage from "./pages/profile";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <MainPage />,
        children: [
          {
            path: "",
            element: <DashboardPage />,
          },
          {
            path: "devices",
            element: <DevicesPage />,
          },
          {
            path: "applications",
            element: <GroupsPage />,
          },
          {
            path: "mqtt-servers",
            element: <MqttServersPage />,
          },
          {
            path: "device-profiles",
            element: <DeviceProfilePage />,
          },
          {
            path: "tenants",
            element: <TenantsPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "flow",
        element: <FlowPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
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
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
