import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './backend/config/db.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './backend/routes/authRoutes.js';
import branchRoutes from './backend/routes/branchRoutes.js';
import jobRoutes from './backend/routes/jobRoutes.js';
import uploadRoutes from './backend/routes/uploadRoutes.js';
import applicationRoutes from './backend/routes/applicationRoutes.js';
import interviewRoutes from './backend/routes/interviewRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Production Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
