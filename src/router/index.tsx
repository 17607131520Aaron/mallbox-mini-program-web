import { lazy } from "react";

import { createHashRouter } from "react-router-dom";
import type { DataRouter } from "react-router-dom";

const LayoutHome = lazy(() => import("@/Layout"));
const Home = lazy(() => import("@/pages/Home"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));

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
    children: [{ index: true, element: <Home /> }],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
