import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useAuth from "@/hooks/useAuth";

export default function Header() {
  const { auth } = useAuth();

  return (
    <div className="drawer sticky top-0 z-20">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Navbar */}
        <div className="navbar text-primary-800 bg-light shadow-sm w-full">
          <div className="flex-none md:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
            <Link to={"/"} className="text-xl font-semibold">
              WeConnect
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-between w-full px-4">
            <Link to={"/"} className="text-xl font-semibold">
              WeConnect
            </Link>
          </div>
        </div>
      </div>
      <div className="drawer-side z-30">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="text-primary-800 bg-light shadow-sm min-h-full w-80 p-8 flex flex-col">
          <Link to={"/"} className="text-xl font-semibold">
            WeConnect
          </Link>
          {/* Sidebar content here */}
          <ul className="mt-8 space-y-2">
            <li>Barber</li>
            <li>Estheticienne</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
