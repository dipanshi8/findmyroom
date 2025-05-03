const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");
const User = require("../models/User");
const { protect } = require("../middlewares/auth");

// Role check middleware
const isTenant = (req, res, next) => {
  if (req.user.role !== "tenant") return res.send("Access Denied: Not a Tenant");
  next();
};

// Existing routes
router.get("/home", protect, isTenant, tenantController.home);
router.post("/book/:id", protect, isTenant, tenantController.bookRoom);
router.get("/bookings", protect, isTenant, tenantController.myBookings);

// 🆕 Show tenant registration form
router.get("/register", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.isTenant) {
    return res.redirect("/tenant/dashboard");
  }
  res.render("tenant/register", { user });
});

// 🆕 Handle tenant registration
router.post("/register", protect, async (req, res) => {
  const { name, phone, gender, address, college, year } = req.body;
  try {
    await User.findByIdAndUpdate(req.user._id, {
      name,
      phone,
      gender,
      address,
      college,
      year,
      isTenant: true,
      role: "tenant", // Optional: ensure role is set
    });
    res.redirect("/tenant/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

// 🆕 Tenant dashboard
router.get("/dashboard", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user.isTenant) return res.redirect("/tenant/register");
  res.render("tenant/dashboard", { user });
});

// Show suggestions page
router.get('/suggestions', protect, async (req, res) => {
  // You can fetch suggestion data here later
  res.render('tenant/suggestions', { user: req.user });
});



module.exports = router;
