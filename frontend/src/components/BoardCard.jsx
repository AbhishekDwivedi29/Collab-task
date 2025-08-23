import React from "react";
import { useNavigate } from "react-router-dom";

export default function BoardCard({ boardDetails }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer"
      onClick={() => navigate(`/board/${boardDetails._id}`)}
    >
      <h3 className="text-xl font-bold text-indigo-700 mb-2">{boardDetails.title}</h3>
      <p className="text-sm text-gray-500 mb-1">
        Created by: {boardDetails.createdBy?.name || "Unknown"}
      </p>
      <p className="text-xs text-gray-400 mb-2">
        Updated: {new Date(boardDetails.updatedAt).toLocaleString()}
      </p>
      <p className="text-sm text-gray-600">
        👥 Members: {boardDetails.members.map((m) => m.user?.name || "Unknown").join(", ")}
      </p>
    </div>
  );
}