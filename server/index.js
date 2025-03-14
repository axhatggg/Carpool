import express from 'express';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import poolRoutes from './routes/pool.js';
import driverRoutes from './routes/driver.js';
import socketLogic from './socket/socket.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React frontend URL
  methods: ['GET', 'POST'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('mongodb connected successfully');
} catch (error) {
  console.log(error);
}

// Routes
app.use('/api/auth', authRoutes); // User Authentication
app.use('/api/pools', poolRoutes); // Pool Routes
app.use('/api/driver', driverRoutes); // Driver Routes

// Create HTTP server and integrate Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // React Frontend
    methods: ['GET', 'POST'],
  },
});

if (!global.io) {
  global.io = io; 
  global.activeUsers = {}; // Store active users
}

// Socket Logic
socketLogic(io);

// Port
const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
