const express = require('express');
const { pool } = require('../db');
const router = express.Router();

// POST /guardar - Guardar o actualizar un juego
router.post('/', async (req, res) => {
  try {
    const { game, date } = req.body;

    // Validar datos requeridos
    if (!game || !date) {
      return res.status(400).json({
        error: 'Campos requeridos: game (string) y date (object/json)'
      });
    }

    // Validar que game sea string
    if (typeof game !== 'string') {
      return res.status(400).json({
        error: 'El campo "game" debe ser un string'
      });
    }

    // Validar que date sea un objeto
    if (typeof date !== 'object' || date === null || Array.isArray(date)) {
      return res.status(400).json({
        error: 'El campo "date" debe ser un objeto JSON válido'
      });
    }

    const client = await pool.connect();

    // Usar UPSERT (INSERT ... ON CONFLICT ... DO UPDATE)
    const query = `
      INSERT INTO games (game, date) 
      VALUES ($1, $2)
      ON CONFLICT (game) 
      DO UPDATE SET date = $2, game = $1
      RETURNING *;
    `;

    const result = await client.query(query, [game, JSON.stringify(date)]);
    client.release();

    const savedGame = result.rows[0];
    
    res.status(200).json({
      success: true,
      message: 'Juego guardado/actualizado exitosamente',
      data: {
        game: savedGame.game,
        date: JSON.parse(savedGame.date)
      }
    });

  } catch (error) {
    console.error('Error en /guardar:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

module.exports = router; 