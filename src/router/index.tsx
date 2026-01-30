import { lazy } from "react";

import { createHashRouter } from "react-router-dom";
import type { DataRouter } from "react-router-dom";

const LayoutHome = lazy(() => import("@/Layout"));
const Home = lazy(() => import("@/pages/Home"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
/**
 * 系统工具
 */
const DebugLogs = lazy(() => import("@/pages/DebugLogs"));
const NetworkLogs = lazy(() => import("@/pages/NetworkLogs"));

/**
 * 系统工具
 */

const router: DataRouter = createHashRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: <LayoutHome />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/debug-logs",
        element: <DebugLogs />,
      },
      {
        path: "/network-logs",
        element: <NetworkLogs />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
