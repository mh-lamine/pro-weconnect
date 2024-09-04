import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

export default function ClientLayout() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-between bg-light text-dark">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
