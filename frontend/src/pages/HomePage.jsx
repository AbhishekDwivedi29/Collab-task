import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <Header />

      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-xl text-center transform transition duration-500 hover:scale-[1.02]">
          <h1 className="text-5xl font-extrabold mb-4 text-indigo-700 tracking-tight">
            🚀 Collab Task
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Your mission control for team productivity. Create boards, assign tasks, and stay in sync — all in real time.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300 shadow-md hover:shadow-lg"
            >
              Register
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500 italic">
            Built for teams that move fast and think smart.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}