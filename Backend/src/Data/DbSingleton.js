import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let poolInstance = null;

const getPool = () => {
  if (!poolInstance) {
    poolInstance = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
      waitForConnections: true,
      queueLimit: 0,
    });
  }

  return poolInstance;
};

const pool = getPool();

const connectDB = async () => {
  try {
    const conn = await getPool().getConnection();
    console.log('Connected to the database');
    return conn;
  } catch (error) {
    console.error('Error connecting:', error.message);
    return null;
  }
};

export { getPool, pool, connectDB };
