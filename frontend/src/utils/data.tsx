import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DevPage from "../pages/dev";
import FlowPage from "../pages/flow";
import MainPage from "../pages/main";
import DashboardPage from "../pages/main/dashboard";
import DeviceProfilePage from "../pages/main/device-profile";
import GroupsPage from "../pages/main/groups";
import MqttServersPage from "../pages/main/mqtt-server";
import DevicesPage from "../pages/main/devices";
import TenantsPage from "../pages/main/tenants";
import UsersPage from "../pages/main/users";
import NotFoundPage from "../pages/notfound";

export const router = createBrowserRouter([
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
            path: "groups",
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
            path: "dev",
            element: <DevPage />,
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

export const defaultConfirmDialogData = {
  title: "Confirm",
  body: "Are you sure?",
  confirmText: "Confirm",
  cancelText: "Cancel",
};
