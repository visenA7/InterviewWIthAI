import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import interviewRoutes from './routes/interview.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Higher limit for transcripts

// Routes
app.use('/api/interview', interviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🤖 AI Interview Trainer Server is live on http://localhost:${PORT}`);
  console.log(`🔗 Connecting to LM Studio at: ${process.env.LM_STUDIO_URL || 'http://localhost:1234/v1'}`);
  console.log(`====================================================`);
});
