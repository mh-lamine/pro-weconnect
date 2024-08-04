import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import ClientLayout from "./layouts/ClientLayout";
import ProviderLayout from "./layouts/ProviderLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import ProviderPage from "./pages/ProviderPage";
import RegisterPage from "./pages/RegisterPage";
import Salon from "./pages/Salon";
import ErrorPage from "./pages/ErrorPage";
import Unauthorized from "./pages/Unauthorized";
import AuthLayout from "./layouts/AuthLayout";
import useAuth from "./hooks/useAuth";

export default function App() {
  const {auth} = useAuth();
  console.log(auth);
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="provider/:providerId" element={<ProviderPage />} />
      </Route>

      {/* auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* protected routes */}
      <Route element={<RequireAuth />}>
        <Route element={<ProviderLayout />}>
          <Route path="salon" element={<Salon />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* error routes */}
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
