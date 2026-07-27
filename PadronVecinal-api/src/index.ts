import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import healthRouter from './routes/health';
import usuarioRouter from './routes/usuario.routes';
import vecinoRoutes from './routes/vecino.routes';
import candidatoRouter from './routes/candidato.routes';
import planchaRoutes from './routes/plancha.routes';
import cargoRoutes from './routes/cargo.routes';
import resultadoRoutes from './routes/resultado.routes';

import { errorHandler } from './middleware/error.middleware';

// Crear aplicación
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// ────────────────────────────────────────────────────
// CORS
// ────────────────────────────────────────────────────

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin Origin (Postman, Insomnia, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Permitir localhost y dominio definido en FRONTEND_URL
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Permitir todos los despliegues de Vercel del proyecto
      if (
        origin.startsWith('https://padron-vecinal-front-') &&
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }

      console.log('❌ CORS bloqueó el origen:', origin);
      callback(new Error('Origen no permitido por CORS'));
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parsear JSON
app.use(express.json());

// Parsear formularios
app.use(express.urlencoded({ extended: true }));

// ────────────────────────────────────────────────────
// RUTAS
// ────────────────────────────────────────────────────

app.use('/health', healthRouter);

app.use('/api/usuarios', usuarioRouter);
app.use('/api/vecinos', vecinoRoutes);
app.use('/api/candidatos', candidatoRouter);
app.use('/api/planchas', planchaRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/resultados', resultadoRoutes);

// Middleware de errores
app.use(errorHandler);

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.json({
    project: 'Padron Vecinal API',
    version: '1.0.0',
    description: 'Servidor Express con TypeScript + PostgreSQL',
    endpoints: {
      health: 'GET /health',
    },
  });
});

// ────────────────────────────────────────────────────
// 404
// ────────────────────────────────────────────────────

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
  });
});

// ────────────────────────────────────────────────────
// INICIAR SERVIDOR
// ────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('\n🚀 Padron Vecinal API iniciada');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Frontend permitido: ${process.env.FRONTEND_URL || 'Vercel Preview'}`);
});

export default app;
