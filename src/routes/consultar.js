const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// GET /consultar - Obtener todos los juegos
router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const query = 'SELECT * FROM games ORDER BY game ASC;';
    const result = await client.query(query);
    
    client.release();

    // Parsear el JSON de cada fila
    const games = result.rows.map(row => ({
      game: row.game,
      date: JSON.parse(row.date)
    }));

    res.status(200).json({
      success: true,
      message: 'Juegos obtenidos exitosamente',
      count: games.length,
      data: games
    });

  } catch (error) {
    console.error('Error en /consultar:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

// GET /consultar/:game - Obtener un juego específico
router.get('/:game', async (req, res) => {
  try {
    const { game } = req.params;

    const client = await pool.connect();
    
    const query = 'SELECT * FROM games WHERE game = $1;';
    const result = await client.query(query, [game]);
    
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Juego no encontrado',
        game: game
      });
    }

    const gameData = result.rows[0];
    
    res.status(200).json({
      success: true,
      message: 'Juego encontrado',
      data: {
        game: gameData.game,
        date: JSON.parse(gameData.date)
      }
    });

  } catch (error) {
    console.error('Error en /consultar/:game:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

module.exports = router; 