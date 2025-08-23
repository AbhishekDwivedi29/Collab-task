import React, { useContext } from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashBoardPage";
import BoardPage from "./pages/BoardPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import GlobalSocketListener from "./listeners/GlobalSocketListener";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
   <>

        <div className="min-h-screen bg-gray-100">
                <GlobalSocketListener />
          <Routes>
      
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/board/:boardId"
              element={
                <PrivateRoute>
                  <BoardPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
        </>
    </AuthProvider>
  );
}





