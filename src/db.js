const { Pool } = require('pg');
require('dotenv').config();

// Configuración de conexión para Railway PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    client.release();
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
  }
};

// Función para crear la tabla si no existe
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    
    // Crear tabla games si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        game TEXT PRIMARY KEY,
        date JSON NOT NULL
      );
    `);
    
    console.log('✅ Tabla games verificada/creada');
    client.release();
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase
}; 