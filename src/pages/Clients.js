import { useState, useEffect } from "react";
import { exportCSV, importCSV } from "../utils/csv";

export default function Clients() {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            name: "Client A",
            email: "a@email.com",
            phone: "1234567890",
            status: "Active",
            value: 5000,
          },
          {
            id: "2",
            name: "Client B",
            email: "b@email.com",
            phone: "9876543210",
            status: "Lost",
            value: 3000,
          },
          {
            id: "3",
            name: "Client C",
            email: "c@email.com",
            phone: "5556667777",
            status: "High Value",
            value: 12000,
          },
        ];
  });

  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active",
    value: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Search, Filter, Sort states
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortField, setSortField] = useState("");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  // Add Client
  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) return;
    setClients([...clients, { ...newClient, id: Date.now().toString() }]);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      status: "Active",
      value: "",
    });
  };

  // Delete Client
  const handleDelete = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  // Edit Client
  const handleEdit = (client) => {
    setEditingId(client.id);
    setNewClient(client);
  };

  // Save Edit
  const handleSaveEdit = () => {
    setClients(clients.map((c) => (c.id === editingId ? newClient : c)));
    setEditingId(null);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      status: "Active",
      value: "",
    });
  };

  // ✅ Export Clients
  const handleExportClients = () => {
    exportCSV("clients.csv", clients);
  };

  // ✅ Import Clients
  const handleImportClients = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const rows = await importCSV(file);

    const existing = JSON.parse(localStorage.getItem("clients")) || [];
    const next = [
      ...existing,
      ...rows
        .filter((r) => r.name)
        .map((r) => ({
          id: r.id || crypto.randomUUID(),
          name: r.name?.trim() || "",
          email: r.email?.trim() || "",
          phone: r.phone?.trim() || "",
          status: r.status?.trim() || "Active",
          value: Number(r.value || 0),
        })),
    ];

    localStorage.setItem("clients", JSON.stringify(next));
    setClients(next);
    e.target.value = "";
  };

  // Filtering + Searching + Sorting
  const filteredClients = clients
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => (filterStatus === "All" ? true : c.status === filterStatus))
    .sort((a, b) => {
      if (sortField === "value") return b.value - a.value;
      if (sortField === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clients Management</h1>

      {/* Add/Edit Form */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Client" : "Add New Client"}
        </h2>
        <div className="grid grid-cols-6 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={newClient.name}
            onChange={(e) =>
              setNewClient({ ...newClient, name: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={newClient.email}
            onChange={(e) =>
              setNewClient({ ...newClient, email: e.target.value })
            }
          />
          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={newClient.phone}
            onChange={(e) =>
              setNewClient({ ...newClient, phone: e.target.value })
            }
          />
          <select
            className="border p-2 rounded"
            value={newClient.status}
            onChange={(e) =>
              setNewClient({ ...newClient, status: e.target.value })
            }
          >
            <option>Active</option>
            <option>Lost</option>
            <option>High Value</option>
          </select>
          <input
            className="border p-2 rounded"
            type="number"
            placeholder="Value"
            value={newClient.value}
            onChange={(e) =>
              setNewClient({ ...newClient, value: e.target.value })
            }
          />
          {editingId ? (
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleAddClient}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Search + Filter + Sort + Export/Import */}
      <div className="flex justify-between items-center mb-4">
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Lost">Lost</option>
          <option value="High Value">High Value</option>
        </select>
        <select
          className="border p-2 rounded"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="name">Name (A-Z)</option>
          <option value="value">Value (High → Low)</option>
        </select>

        {/* Export / Import */}
        <div className="flex gap-3 ml-auto">
          <button
            onClick={handleExportClients}
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Export CSV
          </button>
          <label className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportClients}
            />
          </label>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-3">Clients List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Value</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="border px-4 py-2">{client.name}</td>
                <td className="border px-4 py-2">{client.email}</td>
                <td className="border px-4 py-2">{client.phone}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      client.status === "Active"
                        ? "bg-green-500"
                        : client.status === "Lost"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="border px-4 py-2">${client.value}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
