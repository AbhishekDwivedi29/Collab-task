import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import Column from "../components/Column";
import NotificationBell from "../components/bell";

export default function BoardDetailsPage() {
  const { token, user, logout } = useContext(AuthContext);
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardMembers, setBoardMembers] = useState([]);

  const [newColumnTitle, setNewColumnTitle] = useState("");

  const [showInviteForm, setShowInviteForm] = useState(false);
  const [userIdToInvite, setUserIdToInvite] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const fetchColumns = axios.get(`${import.meta.env.VITE_BoardAPI_URL}/api/columns/${boardId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });


    const fetchMembers = axios.get(`${import.meta.env.VITE_BoardAPI_URL}/api/boards/${boardId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Promise.all([fetchColumns, fetchMembers])
      .then(([columnsRes, membersRes]) => {
        setColumns(columnsRes.data);
        setBoardMembers(membersRes.data || []);
      })
      .catch(() => {
        setColumns([]);
        setBoardMembers([]);
      })
      .finally(() => setLoading(false));
  }, [token, boardId]);


  const handleCreateColumn = async (e) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BoardAPI_URL}/api/columns`,
        { boardId, title: newColumnTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setColumns([...columns, res.data]);
      setNewColumnTitle("");
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setInviteMessage("");

    if (!userIdToInvite.trim()) {
      setInviteMessage("User ID is required");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BoardAPI_URL}/api/boards/${boardId}/invite`,
        { userIdToInvite, role: inviteRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInviteMessage(res.data.message || "User invited successfully");
      setUserIdToInvite("");
      setInviteRole("Viewer");
    } catch (err) {
      setInviteMessage(err.response?.data?.message || "Invite failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-6 sm:p-8">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-indigo-700">Board: {boardId}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage columns and members</p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={() => setShowInviteForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            📩 Invite
          </button>
        </div>
      </div>


      <form
        onSubmit={handleCreateColumn}
        className="mb-10 flex flex-col sm:flex-row gap-4 bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto"
      >
        <input
          type="text"
          placeholder="New column title"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.target.value)}
          className="flex-grow rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring focus:ring-indigo-200 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          ➕ Add Column
        </button>
      </form>

  
      {loading ? (
        <div className="text-gray-600 text-center">Loading board data...</div>
      ) : (
        <div className="flex gap-6 overflow-x-auto px-2 pb-6 scrollbar-hide">
          {columns.map((column) => (
            <Column
              key={column._id}
              column={column}
              boardId={boardId}
              setColumns={setColumns}
              columns={columns}
              boardMembers={boardMembers}
              token={token}
            />
          ))}
        </div>
      )}

     
      {showInviteForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-6 border border-gray-200">
            <button
              onClick={() => setShowInviteForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-indigo-700">Invite User</h2>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <input
                type="text"
                placeholder="User ID"
                value={userIdToInvite}
                onChange={(e) => setUserIdToInvite(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring focus:ring-indigo-200 outline-none"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring focus:ring-indigo-200 outline-none"
              >
                <option value="Viewer">Collaborator</option>
                <option value="Editor">Editor</option>
              </select>
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Send Invite
              </button>
              {inviteMessage && (
                <div className="text-sm text-gray-700">{inviteMessage}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}