import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { authRouter } from './routes/auth.routes';
import { alertRouter } from './routes/alert.routes';
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRouter);

// Rutas protegidas
app.use('/api/users', authMiddleware, userRouter);
app.use('/api/alerts', authMiddleware, alertRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});