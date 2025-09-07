import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";

export default function Sidebar() {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Clients", path: "/clients" },
    { name: "Deals", path: "/deals" },
    { name: "Tasks", path: "/tasks" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-900 shadow-md p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        CRM
      </h1>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-2 rounded transition-all duration-200 ${
              location.pathname === link.path
                ? "bg-blue-500 text-white shadow-md scale-105"
                : "text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white hover:scale-105"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="mt-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded transition-all duration-200 hover:scale-105 hover:shadow"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </div>
  );
}
