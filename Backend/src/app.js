import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import indexRoutes from './routes/index.js'; // Importamos las rutas

const app = express();
// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', indexRoutes);

export default app; // Exportamos la configuración
