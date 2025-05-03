// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token = req.cookies.token;

  // 👇 If token is stored in cookies:
 

  // authController.js

const { role } = req.query;

if (role === "tenant") {
    return res.render("tenant/auth", { error: null, mode: "login" });
} else if (role === "owner") {
    return res.render("owner/auth", { error: null, mode: "login" });
} else {
    return res.redirect("/");  // fallback
}


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error(error);
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};



exports.isOwner = (req, res, next) => {
  if (req.user.role !== "owner") return res.send("Access Denied: Not an Owner");
  next();
};
