import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 4,
  waitForConnections: true,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ Conectado a la base de datos");
    return conn;
  } catch (error) {
    console.error("❌ Error al conectar:", error.message);
  }
};


export { pool, connectDB };
