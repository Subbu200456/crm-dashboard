import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div className="p-6">
      {/* Top Section with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CRM Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-lg">Total Clients</h2>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-lg">Deals Won</h2>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-lg">Revenue</h2>
          <p className="text-3xl font-bold">$120k</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <h2 className="text-lg">Pending Tasks</h2>
          <p className="text-3xl font-bold">18</p>
        </div>
      </div>

      {/* Placeholder for charts */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Performance Charts</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Charts will go here (Revenue, Deals, Conversion Rate).
        </p>
      </div>
    </div>
  );
}
