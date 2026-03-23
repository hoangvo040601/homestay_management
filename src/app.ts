import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';
import { globalLimiter, authLimiter } from './config/rateLimit';
import authRouter from './routes/auth.routes'
import roomRouter from './routes/room.routes'
import guestRouter from './routes/guest.routes'
import bookingRouter from './routes/bookings.routes'
import serviceRoter from './routes/service.routes'
import staffRouter from './routes/staff.routes'
import paymentRouter from './routes/payment.routes'
import reportRouter from './routes/report.routes'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';

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
app.use('/api', globalLimiter);           // tất cả API
app.use('/api/auth/login', authLimiter);  // login chặt hơn


// Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

app.use('/api/auth', authRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/guests', guestRouter);
app.use('/api/bookings',bookingRouter);
app.use('/api/services', serviceRoter)
app.use('/api/staff',staffRouter)
app.use('/api/payments', paymentRouter)
app.use('/api/reports',reportRouter)
app.use(errorMiddleware);


// Swagger UI
if (process.env.NODE_ENV === 'development') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Homestay API Docs',
    customCss: '.swagger-ui .topbar { display: none }',  // ẩn topbar
  }));
  console.log('📖 Swagger docs: http://localhost:3000/api/docs');
}

export default app;