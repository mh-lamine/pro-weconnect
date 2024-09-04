import { Link } from "react-router-dom";
import logo from "/weconnect-no-bg.svg";

export default function Footer() {
  return (
    <>
      <footer className="footer flex flex-col sm:flex-row sm:items-center justify-between bg-dark text-light px-8 py-4">
        <aside className="grid-flow-col items-center">
          <img src={logo} alt="logo weconnect" className="w-12 invert" />
          <p>Copyright © {new Date().getFullYear()} - Tous droits reservés</p>
        </aside>
        <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <Link className="flex items-center gap-2">
              Suivez-nous sur
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-instagram"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
          </div>
        </nav>
      </footer>
    </>
  );
}
