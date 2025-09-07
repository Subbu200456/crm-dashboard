import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ClientDetails() {
  const { id } = useParams();

  const [clients, setClients] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const savedClients = JSON.parse(localStorage.getItem("clients")) || [];
    const savedDeals = JSON.parse(localStorage.getItem("deals")) || [];
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || {};

    setClients(savedClients);
    setDeals(savedDeals);
    setTasks(savedTasks);
    setNotes(savedNotes[id] || []);
  }, [id]);

  const client = clients.find((c) => c.id === id);
  const clientDeals = deals.filter((d) => d.clientId === id);
  const clientTasks = tasks.filter((t) => t.clientId === id);

  // Add Note
  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedNotes = [...notes, { text: newNote, date: new Date().toLocaleString() }];
    setNotes(updatedNotes);

    const allNotes = JSON.parse(localStorage.getItem("notes")) || {};
    allNotes[id] = updatedNotes;
    localStorage.setItem("notes", JSON.stringify(allNotes));

    setNewNote("");
  };

  if (!client) {
    return (
      <div className="p-6">
        <p>Client not found.</p>
        <Link to="/clients" className="text-blue-500 underline">Back to Clients</Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link to="/clients" className="text-blue-500 underline mb-4 inline-block">
        ← Back to Clients
      </Link>

      <h1 className="text-2xl font-bold mb-4">Client Details</h1>

      {/* Client Info */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <p><strong>Name:</strong> {client.name}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Phone:</strong> {client.phone}</p>
        <p><strong>Status:</strong> {client.status}</p>
        <p><strong>Value:</strong> ${client.value}</p>
      </div>

      {/* Deals Section */}
      <h2 className="text-xl font-semibold mb-3">Deals</h2>
      {clientDeals.length > 0 ? (
        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Deal</th>
              <th className="border px-4 py-2">Stage</th>
              <th className="border px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {clientDeals.map((deal) => (
              <tr key={deal.id}>
                <td className="border px-4 py-2">{deal.name}</td>
                <td className="border px-4 py-2">{deal.stage}</td>
                <td className="border px-4 py-2">${deal.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 mb-6">No deals linked to this client.</p>
      )}

      {/* Tasks Section */}
      <h2 className="text-xl font-semibold mb-3">Tasks</h2>
      {clientTasks.length > 0 ? (
        <ul className="bg-white shadow rounded p-4 mb-6">
          {clientTasks.map((task) => (
            <li key={task.id} className="border-b py-2">
              <strong>{task.title}</strong> - {task.status} (Due: {task.dueDate})
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mb-6">No tasks linked to this client.</p>
      )}

      {/* Notes Section */}
      <h2 className="text-xl font-semibold mb-3">Notes</h2>
      <div className="bg-white shadow p-4 rounded mb-6">
        <textarea
          className="border p-2 rounded w-full mb-2"
          rows="3"
          placeholder="Write a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Note
        </button>
      </div>

      {notes.length > 0 ? (
        <ul className="space-y-2">
          {notes.map((note, index) => (
            <li key={index} className="bg-gray-100 p-3 rounded shadow">
              <p>{note.text}</p>
              <span className="text-sm text-gray-500">{note.date}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notes yet.</p>
      )}
    </div>
  );
}
