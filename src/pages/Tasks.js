import { useState, useEffect } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "t1", title: "Follow up call", clientId: "1", dueDate: "2025-09-10", status: "Pending" },
          { id: "t2", title: "Send proposal", clientId: "2", dueDate: "2025-09-12", status: "Completed" },
        ];
  });

  const [newTask, setNewTask] = useState({ title: "", clientId: "", dueDate: "", status: "Pending" });
  const [editingId, setEditingId] = useState(null);

  // Save tasks in localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add task
  const handleAddTask = () => {
    if (!newTask.title || !newTask.clientId) return;
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
    setNewTask({ title: "", clientId: "", dueDate: "", status: "Pending" });
  };

  // Delete task
  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Edit task
  const handleEdit = (task) => {
    setEditingId(task.id);
    setNewTask(task);
  };

  // Save after editing
  const handleSaveEdit = () => {
    setTasks(tasks.map((t) => (t.id === editingId ? newTask : t)));
    setEditingId(null);
    setNewTask({ title: "", clientId: "", dueDate: "", status: "Pending" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks Management</h1>

      {/* Add / Edit Task Form */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-semibold mb-3">
          {editingId ? "Edit Task" : "Add New Task"}
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Client ID"
            value={newTask.clientId}
            onChange={(e) => setNewTask({ ...newTask, clientId: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>
          {editingId ? (
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-3">Tasks List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Client ID</th>
              <th className="border px-4 py-2">Due Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.clientId}</td>
                <td className="border px-4 py-2">{task.dueDate}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      task.status === "Completed" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
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
    </div>
  );
}
