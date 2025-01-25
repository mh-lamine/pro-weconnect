import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

import AuthLayout from "./layouts/AuthLayout";
import Layout from "./layouts/Layout";

import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import logo from "/weconnect-no-bg.svg";
import { Toaster } from "sonner";
import { AlertCircle, CheckCircle } from "lucide-react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Salon = lazy(() => import("./pages/Salon"));
const SalonInformations = lazy(() => import("./pages/SalonInformations"));
const SalonAvailabilities = lazy(() => import("./pages/SalonAvailabilities"));
const SalonServices = lazy(() => import("./pages/SalonServices"));

export default function App() {
  return (
    <>
      <Routes>
        {/* auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route
                path="salon"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Salon />
                  </Suspense>
                }
              />
              <Route
                path="salon/informations"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <SalonInformations />
                  </Suspense>
                }
              />
              <Route
                path="salon/availabilities"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <SalonAvailabilities />
                  </Suspense>
                }
              />
              <Route
                path="salon/services"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <SalonServices />
                  </Suspense>
                }
              />
            </Route>
          </Route>
        </Route>

        {/* error routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster
        position="top-right"
        icons={{
          success: <CheckCircle />,
          error: <AlertCircle />,
        }}
        toastOptions={{
          style: {
            display: "flex",
            gap: "2em",
            whiteSpace: "pre-line",
          },
          classNames: {
            error: "bg-destructive text-light",
            success: "bg-success text-light",
          },
        }}
      />
    </>
  );
}

const PageLoader = () => (
  <div className="w-screen h-screen grid place-items-center bg-light">
    <img src={logo} alt="Logo" className="w-20 h-20 animate-spin" />
  </div>
);
