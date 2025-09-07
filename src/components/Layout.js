import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";   // ✅ only Sidebar
import { useState } from "react";

export default function Layout() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Example notifications
  const notifications = [
    { id: 1, text: "New client added: Client A" },
    { id: 2, text: "Deal won: Mobile App ($12,000)" },
    { id: 3, text: "Task due: Follow up with Client B" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-end items-center bg-white dark:bg-gray-900 shadow p-4 relative">
          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-gray-700 dark:text-white"
          >
            🔔
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
              {notifications.length}
            </span>
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-4 top-14 w-64 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-3">
              <h3 className="font-bold mb-2 text-gray-800 dark:text-white">
                Notifications
              </h3>
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="p-2 bg-gray-100 dark:bg-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
                  >
                    {n.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Page content */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
