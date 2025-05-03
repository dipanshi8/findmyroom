const Room = require("../models/Room");

exports.home = async (req, res) => {
  try {
    const rooms = await Room.find({ isBooked: false }).populate("owner", "name");
    res.render("tenant/home", { rooms });
  } catch (err) {
    res.status(500).send("Error loading rooms");
  }
};

exports.bookRoom = async (req, res) => {
  const roomId = req.params.id;
  try {
    await Room.findByIdAndUpdate(roomId, {
         isBooked: true,
         bookedBy: req.user._id,
        });
    res.redirect("/tenant/home");
  } catch (err) {
    res.status(500).send("Error booking room");
  }
};


exports.myBookings = async (req, res) => {
    try {
      const bookedRooms = await Room.find({ bookedBy: req.user._id }).populate("owner", "name");
      res.render("tenant/bookings", { rooms: bookedRooms });
    } catch (err) {
      res.status(500).send("Error fetching bookings");
    }
  };
  