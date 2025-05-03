const Room = require("../models/Room");

exports.dashboard = async (req, res) => {
    try {
      const rooms = await Room.find({ owner: req.user._id }).populate("bookedBy", "name email");
      res.render("owner/dashboard", { rooms });
    } catch (err) {
      res.status(500).send("Failed to fetch your rooms");
    }
  };
  

exports.getAddRoom = (req, res) => {
  res.render("owner/addRoom");
};

exports.postAddRoom = async (req, res) => {
  const { title, description, location, price, amenities } = req.body;
  const image = req.file ? req.file.filename : "default.jpg";

  try {
    await Room.create({
      owner: req.user._id,
      title,
      description,
      location,
      price,
      amenities: amenities.split(",").map((item) => item.trim()),
    });
    res.redirect("/owner/dashboard");
  } catch (err) {
    res.status(500).send("Room creation failed");
  }
};
