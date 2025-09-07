import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Reports() {
  const [clients, setClients] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    setClients(JSON.parse(localStorage.getItem("clients")) || []);
    setDeals(JSON.parse(localStorage.getItem("deals")) || []);
  }, []);

  // -------- Revenue (demo data) --------
  const revenueLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenueValues = [1200, 3000, 2500, 4000, 2800, 5000];

  const revenueData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Revenue ($)",
        data: revenueValues,
        borderColor: "#4F46E5", // Indigo line
        backgroundColor: "rgba(79,70,229,0.2)", // Soft fill
        borderWidth: 3,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#fff" }, // Legend text in white
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: { color: "#ddd" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#ddd" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  // -------- Conversion pie (Won vs Lost) --------
  const won = deals.filter((d) => d.stage === "Won").length;
  const lost = deals.filter((d) => d.stage === "Lost").length;

  const conversionData = {
    labels: ["Won", "Lost"],
    datasets: [
      {
        data: [won, lost],
        backgroundColor: ["#10B981", "#EF4444"], // green & red
        borderWidth: 1,
      },
    ],
  };

  // -------- Top clients --------
  const wonByClient = deals
    .filter((d) => d.stage === "Won")
    .reduce((acc, d) => {
      const key = d.clientId || d.client || "";
      const val = Number(d.value || 0);
      acc[key] = (acc[key] || 0) + val;
      return acc;
    }, {});

  const topClients = [...clients]
    .map((c) => ({
      ...c,
      total: Number(c.value || 0) || wonByClient[c.id] || 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Revenue Trends */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover-card">
        <h2 className="text-xl font-bold mb-4">Revenue Trends</h2>
        <Line data={revenueData} options={revenueOptions} />
      </div>

      {/* Conversion + Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Rate */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover-card">
          <h2 className="text-xl font-bold mb-4">Conversion Rate</h2>
          <Doughnut
            data={conversionData}
            options={{
              plugins: {
                legend: {
                  labels: { color: "#fff" },
                  position: "bottom",
                },
              },
              cutout: "55%",
            }}
          />
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            <p>
              Won: <b>{won}</b> &nbsp;•&nbsp; Lost: <b>{lost}</b>
            </p>
          </div>
        </div>

        {/* Top Clients */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow hover-card">
          <h2 className="text-xl font-bold mb-4">Top Clients</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 border dark:border-gray-700">Client</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Email</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Value</th>
                </tr>
              </thead>
              <tbody>
                {topClients.length ? (
                  topClients.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-2 border dark:border-gray-700">
                        {c.name}
                      </td>
                      <td className="px-4 py-2 border dark:border-gray-700">
                        {c.email || "-"}
                      </td>
                      <td className="px-4 py-2 border dark:border-gray-700">
                        ${Number(c.total || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-3 text-gray-500 dark:text-gray-400"
                      colSpan={3}
                    >
                      No clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
