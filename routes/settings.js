const express = require('express');
const router = express.Router();
const sql = require('mssql')
const db = require('../config/db');

// Render settings page
router.get('/settings', async (req, res) => {
  try {
    // Fetch existing settings from the database
    const pool = await db;
    const result = await pool.request().query("SELECT * FROM setting");
    const settings = result.recordset[0] || {}; 
    res.render('settings', { settings });
  } catch (error) {
    console.error(`Error fetching settings: ${error}`);
    res.status(500).send('Error loading settings page');
  }
});

// Update settings
router.post('/settings', async (req, res) => {
  const { maxExpiryTime, voucherWidth, voucherHeight, titleFontSize, textFontSize } = req.body;

  try {
    const pool = await db;

    await pool.request()
      .input('maxExpiryTime', sql.Int, maxExpiryTime)
      .input('voucherWidth', sql.Float, voucherWidth)
      .input('voucherHeight', sql.Float, voucherHeight)
      .input('titleFontSize', sql.Int, titleFontSize)
      .input('textFontSize', sql.Int, textFontSize)
      .query(`
        UPDATE setting SET
          maxExpiryTime = @maxExpiryTime,
          voucherWidth = @voucherWidth,
          voucherHeight = @voucherHeight,
          titleFontSize = @titleFontSize,
          textFontSize = @textFontSize
      `);

    res.redirect('/dashboard');
  } catch (error) {
    console.error(`Error updating settings: ${error}`);
    res.status(500).send('Error updating settings');
  }
});

module.exports = router;
