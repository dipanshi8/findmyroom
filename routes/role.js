const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed

// Show role selection page
router.get('/', (req, res) => {
  res.render('role'); // Ensure you have views/role.ejs
});

// Handle tenant role selection
router.post('/tenant', async (req, res) => {
  try {
    // Redirect to tenant signup/login (create account)
    res.redirect('/tenant/auth'); // Route to your tenant auth page
  } catch (err) {
    console.error(err);
    res.redirect('/error');
  }
});

// Handle owner role selection
router.post('/owner', async (req, res) => {
  try {
    // Redirect to owner signup/login (create account)
    res.redirect('/owner/auth'); // Route to your owner auth page
  } catch (err) {
    console.error(err);
    res.redirect('/error');
  }
});

module.exports = router;
