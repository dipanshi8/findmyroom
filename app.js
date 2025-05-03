const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require("cookie-parser");
const path = require("path");

const app=express();

// Session middleware
app.use(session({
    secret: 'Yghdndyggj',  // 👈 put any random string here
    resave: false,
    saveUninitialized: true
}));

// Flash middleware
app.use(flash());

// Pass flash messages to all views
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const ownerRoutes = require("./routes/owner");
const tenantRoutes = require("./routes/tenant");
const indexRoutes = require("./routes/index");
const roleRoutes = require('./routes/role');
const User = require('./models/User');



dotenv.config();
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", authRoutes);
app.use("/owner", ownerRoutes);
app.use("/tenant", tenantRoutes);
app.use("/", indexRoutes);
app.use('/', roleRoutes);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Role selection page
app.get('/role', (req, res) => {
  res.render('role');  // Renders role.ejs
});

// Tenant Register
app.get('/register/tenant', (req, res) => {
  res.render('register-tenant',{ messages: req.flash() });  // Renders register-tenant.ejs
});

// Owner Register
app.get('/register/owner', (req, res) => {
  res.render('register-owner', { messages: req.flash() });  // Renders register-owner.ejs
});

// Tenant Login
app.get('/login/tenant', (req, res) => {
  res.render('login-tenant',{ messages: req.flash() });  // Renders login-tenant.ejs
});

// Owner Login
app.get('/login/owner', (req, res) => {
  res.render('login-owner', { messages: req.flash() });  // Renders login-owner.ejs
});

// GET Tenant Onboarding Page
app.get('/tenant/onboarding', (req, res) => {
  res.render('tenant-onboarding');  // 🔥 create tenant-onboarding.ejs
});

// GET Owner Onboarding Page
app.get('/owner/onboarding', (req, res) => {
  res.render('owner-onboarding');  // 🔥 create owner-onboarding.ejs
});

// Tenant routes
app.get('/tenant/preferences', (req, res) => {
  res.render('tenant/preferences');
});


// Owner dashboard route
app.get('/owner/dashboard', (req, res) => {
  res.render('owner/dashboard');
});



// Tenant login route
app.post('/login/tenant', async (req, res) => {
  const { email, password } = req.body;

  try {
      // 👉 THIS is where you use:
      const user = await User.findOne({ email, role: 'tenant' });

      if (!user || !(await user.matchPassword(password))) {
          req.flash('error', 'Email or Password is incorrect');
          return res.redirect('/login/tenant');
      }

      // Login success logic (set session, token, etc.)
      req.flash('success', 'Logged in successfully');
      res.redirect('/tenant/dashboard'); // or wherever you want to send them
  } catch (err) {
      console.error(err);
      req.flash('error', 'Something went wrong');
      res.redirect('/login/tenant');
  }
});

app.post('/register/tenant', async (req, res) => {
  const { name, email, password } = req.body;

  try {
      // ✅ Check if user already exists
      const existingUser = await User.findOne({ email, role: 'tenant' });
      if (existingUser) {
          req.flash('error', 'Email is already registered.');
          return res.redirect('/register/tenant');
      }

      await User.create({
          name,
          email,
          password,
          role: 'tenant',
          isTenant: true
      });

      req.flash('success', 'User created successfully');
      res.redirect('/tenant/onboarding');
  } catch (err) {
      console.error(err);
      req.flash('error', 'Something went wrong.');
      res.redirect('/register/tenant');
  }
});

// Owner login route
app.post('/login/owner', async (req, res) => {
  const { email, password } = req.body;

  try {
      // 👉 THIS is where you use:
      const user = await User.findOne({ email, role: 'owner' });

      if (!user || !(await user.matchPassword(password))) {
          req.flash('error', 'Email or Password is incorrect');
          return res.redirect('/login/owner');
      }

      // Login success logic
      req.flash('success', 'Logged in successfully');
      res.redirect('/owner/dashboard');
  } catch (err) {
      console.error(err);
      req.flash('error', 'Something went wrong');
      res.redirect('/login/owner');
  }
});


app.post('/register/owner', async (req, res) => {
  const { name, email, password } = req.body;

  try {
      // ✅ Check if user already exists
      const existingUser = await User.findOne({ email, role: 'owner' });
      if (existingUser) {
          req.flash('error', 'Email is already registered.');
          return res.redirect('/register/owner');
      }

      await User.create({
          name,
          email,
          password,
          role: 'owner',
          isOwner: true
      });

      req.flash('success', 'User created successfully');
      res.redirect('/owner/onboarding');
  } catch (err) {
      console.error(err);
      req.flash('error', 'Something went wrong.');
      res.redirect('/register/owner');
  }
});

// Tenant Onboarding POST handler
app.post('/tenant/onboarding', (req, res) => {
  // TODO: Save tenant data to DB here
  console.log('Tenant onboarding data:', req.body);

  // After saving data, redirect to tenant preferences
  res.redirect('/tenant/preferences');
});

// Owner Onboarding POST handler
app.post('/owner/onboarding', (req, res) => {
  // TODO: Save owner data to DB here
  console.log('Owner onboarding data:', req.body);

  // After saving data, redirect to owner dashboard
  res.redirect('/owner/dashboard');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
    res.render('landing');
  });

