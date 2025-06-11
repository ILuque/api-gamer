const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, initializeDatabase } = require('./db');
const guardarRoutes = require('./routes/guardar');
const consultarRoutes = require('./routes/consultar');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/guardar', guardarRoutes);
app.use('/consultar', consultarRoutes);

// Ruta de salud
app.get('/', (req, res) => {
  res.json({
    message: 'API Railway - Gestión de Juegos',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /guardar': 'Guardar o actualizar un juego',
      'GET /consultar': 'Obtener todos los juegos',
      'GET /consultar/:game': 'Obtener un juego específico'
    }
  });
});

// Ruta de health check para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: error.message
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Inicializar base de datos (crear tabla si no existe)
    await initializeDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`📖 Documentación disponible en: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Manejar cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Cerrando servidor...');
  process.exit(0);
});

startServer(); 