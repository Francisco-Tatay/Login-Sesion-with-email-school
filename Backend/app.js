import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import indexRoutes from "./routes/index.js"; // Importamos las rutas
import { connectDB } from "./Data/Db.js";

const app = express();
connectDB();
// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/", indexRoutes);

export default app; // Exportamos la configuración
