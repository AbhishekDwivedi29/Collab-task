import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BoardCard from "../components/BoardCard";
import NotificationBell from "../components/bell";

export default function DashboardPage() {
  const { token, user, logout, boards, setBoards ,setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [error, setError] = useState("");
  const [boardDetails, setBoardDetails] = useState("");

  const navigate = useNavigate();

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BoardAPI_URL}/api/boards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
   
      setBoardDetails(res.data);
     
    } catch (err) {
      // console.error("Failed to fetch boards:", err);
      setError("Unable to load boards");
      setBoardDetails([]);
    } finally {
      setLoading(false);
    }
  }, [token]);



  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchBoards();
    }
  }, [token, fetchBoards]);




  const handleCreateBoard = async (e) => {
    e.preventDefault();
    setError("");
    if (!newBoardTitle.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BoardAPI_URL}/api/boards`,
        { title: newBoardTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

    const updatedBoards = [res.data._id, ...boards];
    const updatedUser = {
      ...user,
      boards: [res.data._id, ...user.boards],
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("boards", JSON.stringify(updatedBoards));
    setUser(updatedUser);
    setBoardDetails((prev) => [res.data, ...prev]);
    setBoards(updatedBoards);
    setNewBoardTitle("");

    } catch (err) {
  //  console.error("Board creation error:", err);
   setError(err.response?.data?.message || "Failed to create board");
    }
  };



  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <Header />

      <main className="flex-grow px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-indigo-700">Welcome, {user?.name}</h1>
              <p className="text-sm text-gray-500">Manage your boards and collaborate in real time</p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell  />
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <form onSubmit={handleCreateBoard} className="flex gap-4 mb-10">
            <input
              type="text"
              placeholder="Enter board title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 outline-none"
            />
            <button
              type="submit"
              disabled={!newBoardTitle.trim()}
              className={`bg-indigo-600 text-white px-6 py-2 rounded-lg transition ${
                !newBoardTitle.trim() ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
              }`}
            >
              ➕ Create Board
            </button>
          </form>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="animate-pulse text-gray-400">Loading boards...</div>
          ) : boardDetails.length === 0 ? (
            <div className="text-gray-500 italic">No boards yet. Create one to get started!</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {boardDetails.map((boardDetails) => (
                <BoardCard key={boardDetails._id} boardDetails={boardDetails} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}