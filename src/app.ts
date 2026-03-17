import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config'
// import { env } from './config/env';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes (sẽ thêm dần ở Phase 3)
// app.use('/api/auth', authRoutes);
// app.use('/api/rooms', roomRoutes);
// ...

export default app;