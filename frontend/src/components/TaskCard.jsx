import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function TaskCard({
  task,
  columns,
  columnId,
  boardId,
  boardMembers,
  setColumns,
  token,
}) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");

  const handleMoveTask = async (e) => {
    const newColumnId = e.target.value;
    if (newColumnId === columnId) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BoardAPI_URL}/api/tasks/move`,
        { taskId: task._id, newColumnId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setColumns((prev) => {
        const taskToMove = task;
        return prev.map((col) => {
          if (col._id === columnId) {
            return {
              ...col,
              tasks: col.tasks.filter((t) => t._id !== task._id),
            };
          }
          if (col._id === newColumnId) {
            return {
              ...col,
              tasks: [...col.tasks, taskToMove],
            };
          }
          return col;
        });
      });
    } catch (err) {
      // console.error("Task move failed:", err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BoardAPI_URL}/api/tasks/${task._id}/comments`,
        { message: comment, user: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedTask = {
        ...task,
        comments: [...(task.comments || []), { message: comment, user: { name: user.name } }],
      };

      setColumns((prev) =>
        prev.map((col) =>
          col._id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((t) => (t._id === task._id ? updatedTask : t)),
              }
            : col
        )
      );

      setComment("");
    } catch (err) {
      // console.error("Comment failed:", err.message);
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-white via-indigo-50 to-purple-100 p-5 shadow-md border border-indigo-100 transition hover:shadow-lg">
      <div className="mb-2 text-lg font-bold text-indigo-700">{task.title}</div>

      <div className="mb-3 text-sm text-gray-600">
        Assigned to:{" "}
        <span className="font-medium text-indigo-800">
          {task.assignedTo?.name || "Unassigned"}
        </span>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-xs font-semibold text-gray-500">Move Task</label>
        <select
          value={columnId}
          onChange={handleMoveTask}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-indigo-200 outline-none"
        >
          {columns.map((col) => (
            <option key={col._id} value={col._id}>
              {col.title}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleAddComment} className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-grow rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring focus:ring-indigo-200 outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
        >
          💬 Comment
        </button>
      </form>

      <div className="mb-2 text-xs font-semibold text-gray-500">Comments</div>
      <ul className="space-y-2 text-sm text-gray-700">
        {task.comments?.map((c, idx) => (
          <li key={idx} className="bg-white rounded-md px-3 py-2 shadow-sm">
            <span className="font-semibold text-indigo-700">
              {c.user?.name || "User"}:
            </span>{" "}
            {c.message}
          </li>
        ))}
      </ul>
    </div>
  );
}