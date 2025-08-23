import React, { useState } from "react";
import axios from "axios";
import TaskCard from "./TaskCard";

export default function Column({ boardMembers, column, boardId, setColumns, columns, token }) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState({ _id: "", name: "", email: "", role: "" });
  const [description, setDescription] = useState("");

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const { data: newTask } = await axios.post(
        `${import.meta.env.VITE_BoardAPI_URL}/api/tasks`,
        {
          boardId,
          columnId: column._id,
          title: newTaskTitle,
          assignedTo,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col._id === column._id ? { ...col, tasks: [...col.tasks, newTask] } : col
        )
      );
      setNewTaskTitle("");
      setAssignedTo("");
      setDescription("");
    } catch (err) {
      // console.error("Task creation failed:", err.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-lg p-6 min-w-[320px] flex flex-col gap-4">
      <div className="text-xl font-bold text-indigo-700 flex justify-between items-center">
        {column.title}
      </div>

      <form
        onSubmit={handleCreateTask}
        className="bg-white rounded-xl shadow-md p-4 space-y-3"
      >
        <input
          type="text"
          placeholder="Task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-indigo-200 outline-none"
          required
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-indigo-200 outline-none resize-none"
          rows={2}
        />

        <select
          value={JSON.stringify(assignedTo)}
          onChange={(e) => setAssignedTo(JSON.parse(e.target.value))}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-indigo-200 outline-none"
        >
          <option value="">Assign user</option>
          {boardMembers.map((u) => (
            <option key={u._id} value={JSON.stringify(u)}>
              {u.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Task
        </button>
      </form>

      <div className="space-y-3">
        {column.tasks?.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            boardMembers={boardMembers}
            columns={columns}
            columnId={column._id}
            boardId={boardId}
            setColumns={setColumns}
            token={token}
          />
        ))}
      </div>
    </div>
  );
}