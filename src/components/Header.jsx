import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="drawer sticky top-0 z-20">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        <div className="navbar text-primary-800 bg-light shadow-sm w-full">
          <div className="flex items-center justify-between w-full px-4">
            <Link to={"/"} className="text-xl font-semibold">
              WeConnect Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
