import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h2 className="text-xl font-bold text-indigo-700">Collab Task</h2>
      <nav className="flex gap-4">
        <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
        <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
        <Link to="/register" className="text-gray-600 hover:text-indigo-600">Register</Link>
      </nav>
    </header>
  );
}