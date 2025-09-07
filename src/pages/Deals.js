import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { exportCSV, importCSV } from "../utils/csv";

export default function Deals() {
  // ✅ Load clients from localStorage (for dropdown)
  const [clients] = useState(() => {
    const saved = localStorage.getItem("clients");
    return saved ? JSON.parse(saved) : [];
  });

  const [deals, setDeals] = useState(() => {
    const saved = localStorage.getItem("deals");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "1",
            name: "Website Redesign",
            client: "Client A",
            clientId: "1",
            stage: "Leads",
            value: 5000,
          },
          {
            id: "2",
            name: "Mobile App",
            client: "Client B",
            clientId: "2",
            stage: "Negotiation",
            value: 12000,
          },
          {
            id: "3",
            name: "SEO Project",
            client: "Client C",
            clientId: "3",
            stage: "Won",
            value: 8000,
          },
          {
            id: "4",
            name: "CRM Setup",
            client: "Client D",
            clientId: "4",
            stage: "Lost",
            value: 3000,
          },
        ];
  });

  const [newDeal, setNewDeal] = useState({
    name: "",
    clientId: "",
    stage: "Leads",
    value: "",
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("deals", JSON.stringify(deals));
  }, [deals]);

  // Add Deal
  const handleAddDeal = () => {
    if (!newDeal.name || !newDeal.clientId || !newDeal.value) return;

    const clientObj = clients.find((c) => c.id === newDeal.clientId);

    setDeals([
      ...deals,
      {
        id: Date.now().toString(),
        name: newDeal.name,
        client: clientObj ? clientObj.name : "",
        clientId: newDeal.clientId,
        stage: newDeal.stage,
        value: newDeal.value,
      },
    ]);

    setNewDeal({ name: "", clientId: "", stage: "Leads", value: "" });
  };

  // Delete Deal
  const handleDelete = (id) => {
    setDeals(deals.filter((deal) => deal.id !== id));
  };

  // Edit Deal
  const handleEdit = (deal) => {
    setEditingId(deal.id);
    setNewDeal({
      name: deal.name,
      clientId: deal.clientId,
      stage: deal.stage,
      value: deal.value,
    });
  };

  // Save Edit
  const handleSaveEdit = () => {
    const clientObj = clients.find((c) => c.id === newDeal.clientId);

    setDeals(
      deals.map((deal) =>
        deal.id === editingId
          ? {
              ...deal,
              name: newDeal.name,
              client: clientObj ? clientObj.name : "",
              clientId: newDeal.clientId,
              stage: newDeal.stage,
              value: newDeal.value,
            }
          : deal
      )
    );

    setEditingId(null);
    setNewDeal({ name: "", clientId: "", stage: "Leads", value: "" });
  };

  // ✅ Export CSV
  const handleExportDeals = () => {
    exportCSV("deals.csv", deals);
  };

  // ✅ Import CSV
  const handleImportDeals = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const rows = await importCSV(file);

    const existing = JSON.parse(localStorage.getItem("deals")) || [];
    const next = [
      ...existing,
      ...rows
        .filter((r) => r.name)
        .map((r) => ({
          id: r.id || crypto.randomUUID(),
          name: r.name?.trim() || "",
          clientId: (r.clientId || "").toString(),
          client: clients.find((c) => c.id === (r.clientId || "").toString())
            ?.name || "",
          stage: r.stage || "Leads",
          value: Number(r.value || 0),
        })),
    ];

    localStorage.setItem("deals", JSON.stringify(next));
    setDeals(next);
    e.target.value = "";
  };

  // Drag & Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const updatedDeals = Array.from(deals);
    const [movedDeal] = updatedDeals.splice(result.source.index, 1);
    movedDeal.stage = result.destination.droppableId;
    updatedDeals.splice(result.destination.index, 0, movedDeal);
    setDeals(updatedDeals);
  };

  const stages = ["Leads", "Negotiation", "Won", "Lost"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deals Management</h1>

      {/* Add / Edit Deal Form */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Deal" : "Add New Deal"}
        </h2>
        <div className="grid grid-cols-5 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Deal Name"
            value={newDeal.name}
            onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newDeal.clientId}
            onChange={(e) =>
              setNewDeal({ ...newDeal, clientId: e.target.value })
            }
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={newDeal.stage}
            onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
          >
            {stages.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Value"
            value={newDeal.value}
            onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
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
              onClick={handleAddDeal}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Deal
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Export/Import */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={handleExportDeals}
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
            onChange={handleImportDeals}
          />
        </label>
      </div>

      {/* Deals Table */}
      <div className="bg-white p-4 shadow rounded mb-10">
        <h2 className="text-lg font-semibold mb-3">Deals Table</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Deal</th>
              <th className="border px-4 py-2">Client</th>
              <th className="border px-4 py-2">Stage</th>
              <th className="border px-4 py-2">Value</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr key={deal.id}>
                <td className="border px-4 py-2">{deal.name}</td>
                <td className="border px-4 py-2">{deal.client}</td>
                <td className="border px-4 py-2">{deal.stage}</td>
                <td className="border px-4 py-2">${deal.value}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(deal)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kanban Board */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Deals Kanban Board</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-4">
            {stages.map((stage) => (
              <Droppable key={stage} droppableId={stage}>
                {(provided) => (
                  <div
                    className="bg-gray-100 p-4 rounded min-h-[300px]"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="font-bold mb-3">{stage}</h3>
                    {deals
                      .filter((deal) => deal.stage === stage)
                      .map((deal, index) => (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="bg-white p-3 mb-2 shadow rounded"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <p className="font-medium">{deal.name}</p>
                              <p className="text-sm text-gray-600">
                                {deal.client}
                              </p>
                              <p className="text-sm font-semibold">
                                ${deal.value}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
