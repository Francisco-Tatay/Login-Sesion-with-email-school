import { getPool } from './DbSingleton.js';

const connectDB = async () => {
  let conn;
  try {
    conn = await getPool().getConnection();
    console.log('✅ Conectado a la base de datos');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    return false;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export { connectDB };
export { pool } from './DbSingleton.js';
