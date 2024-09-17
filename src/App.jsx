import { useEffect, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

import AuthLayout from "./layouts/AuthLayout";
import Layout from "./layouts/Layout";

import useAuth from "./hooks/useAuth";
import useAxiosPrivate from "./hooks/useAxiosPrivate";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ErrorPage from "./pages/ErrorPage";
import logo from "/weconnect-no-bg.svg";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Salon = lazy(() => import("./pages/Salon"));
const SalonInformations = lazy(() => import("./pages/SalonInformations"));
const SalonAvailabilities = lazy(() => import("./pages/SalonAvailabilities"));
const SalonServices = lazy(() => import("./pages/SalonServices"));
const SalonPhotos = lazy(() => import("./pages/SalonPhotos"));

export default function App() {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axiosPrivate.get("/api/users");
        !response.data.isProvider &&
          window.location.replace("https://weconnect-rdv.fr");
        setAuth((prev) => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
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
            <Route
              path="salon/photos"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SalonPhotos />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Route>

      {/* error routes */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

const PageLoader = () => (
  <div className="w-screen h-screen grid place-items-center bg-light">
    <img src={logo} alt="Logo" className="w-20 h-20 animate-spin" />
  </div>
);
