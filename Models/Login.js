const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  type: {
    type: String,
    default: "student"
  }
});

module.exports = mongoose.model("Login", loginSchema);
