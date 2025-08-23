import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_UserAPI_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 to-indigo-200">
      <Header />

      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Create an account to start collaborating!
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}


