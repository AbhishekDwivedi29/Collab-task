const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken'); 
const { handleSocketConnection } = require('./socket');
require('dotenv').config();

const boardRoutes = require('./routes/boardRoutes');
const columnRoutes = require('./routes/columnRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
  }
});

   
  
  app.use((req, res, next) => {
    req.io = io;
    next();
  });


  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });
  
  io.on('connection', (socket) => {
    handleSocketConnection(socket, io);
  });

app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);


mongoose.connect(process.env.MONGO_URI,{family:4})
  .then(() => {
    // console.log("Connected to MongoDB (Board Service)");
    server.listen(process.env.PORT || 5002, () => {
      // console.log("Board service running on port", process.env.PORT || 5002);
    });
    }).catch(err => console.error("MongoDB error:", err));







  
  
  
  
  
  
  



