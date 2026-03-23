import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';
import authRouter from './routes/auth.routes'
import roomRouter from './routes/room.routes'
import guestRouter from './routes/guest.routes'
import bookingRouter from './routes/bookings.routes'
import serviceRoter from './routes/service.routes'
import staffRouter from './routes/staff.routes'
import paymentRouter from './routes/payment.routes'
import reportRouter from './routes/report.routes'

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,                           // ← cần set origin cụ thể
  credentials: true,       
}));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/guests', guestRouter);
app.use('/api/bookings',bookingRouter);
app.use('/api/services', serviceRoter)
app.use('/api/staff',staffRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/reports',reportRouter)
app.use(errorMiddleware);
// Routes (sẽ thêm dần ở Phase 3)
// app.use('/api/auth', authRoutes);
// app.use('/api/rooms', roomRoutes);
// ...

export default app;