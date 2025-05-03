// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET /register
exports.getRegister = (req, res) => {
  const { role } = req.query;  // e.g., /register?role=tenant or /register?role=owner

  if (role === "tenant") {
    return res.render("tenant/auth", { error: null, mode: "register" });
  } else if (role === "owner") {
    return res.render("owner/auth", { error: null, mode: "register" });
  } else {
    return res.redirect("/");  // fallback
  }
};

// POST /register
exports.postRegister = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (role !== "tenant" && role !== "owner") {
    return res.redirect("/");  // invalid role fallback
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render(`${role}/auth`, { error: "User already exists", mode: "register" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isTenant: role === "tenant",
      isOwner: role === "owner"
    });
    await newUser.save();

    // ✅ Create JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Set session
    req.session.userId = newUser._id;
    req.session.role = role;

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ Redirect to detail form after register
    if (role === "tenant") {
      return res.redirect("/tenant/register");  // tenant detail form
    } else if (role === "owner") {
      return res.redirect("/owner/register");  // owner detail form
    }

  } catch (err) {
    console.error(err);
    return res.render(`${role}/auth`, { error: "Something went wrong. Please try again.", mode: "register" });
  }
};

// GET /login
exports.getLogin = (req, res) => {
  const { role } = req.query;  // e.g., /login?role=tenant or /login?role=owner

  if (role === "tenant") {
    return res.render("tenant/auth", { error: null, mode: "login" });
  } else if (role === "owner") {
    return res.render("owner/auth", { error: null, mode: "login" });
  } else {
    return res.redirect("/");  // fallback
  }
};

// POST /login
exports.postLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (role !== "tenant" && role !== "owner") {
    return res.redirect("/");  // invalid role fallback
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render(`${role}/auth`, { error: "User not found", mode: "login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render(`${role}/auth`, { error: "Invalid password", mode: "login" });
    }

    // ✅ Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Set session
    req.session.userId = user._id;
    req.session.role = role;

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ Redirect based on role
    if (user.isTenant) return res.redirect("/tenant/dashboard");
    if (user.isOwner) return res.redirect("/owner/dashboard");

    // fallback in case something's wrong with user data
    return res.redirect("/role");

  } catch (err) {
    console.error(err);
    return res.render(`${role}/auth`, { error: "Something went wrong. Please try again.", mode: "login" });
  }
};

// GET /logout
exports.logout = (req, res) => {
  req.session.destroy();  // clear session
  res.clearCookie("token");
  res.redirect("/");
};
