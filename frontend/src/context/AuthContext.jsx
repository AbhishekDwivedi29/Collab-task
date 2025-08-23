import React, { createContext, useState } from "react";
import socket from "../socket"; // inside AuthContext
export const AuthContext = createContext();
import { useNotificationStore } from "../components/notify";

export const AuthProvider = ({ children }) => {
   const clearNotifications = useNotificationStore((s) => s.clearNotifications);
const [token, setToken] = useState(localStorage.getItem("token") || "");
const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});
const [boards, setBoards] = useState(() => {
  const storedBoards = localStorage.getItem("boards");
  try {
    return storedBoards ? JSON.parse(storedBoards) : [];
  } catch {
    return [];
  }
});

  const login = (token, userData) => {
    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(userData));
    const boards =userData.boards;
  
   localStorage.setItem("boards", JSON.stringify(boards)); 
    setToken(token);
    setBoards(boards)
    setUser(userData);
  };

const logout = () => {

  socket.removeAllListeners(); 
  socket.disconnect();         
  socket.auth = {};            
  socket.io.opts.query = {};  


  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("boards");

 
  clearNotifications(); 


  setBoards([]);
  setToken("");
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ user, token,boards,setBoards, login, logout ,setUser}}>
      {children}
    </AuthContext.Provider>
  );
};