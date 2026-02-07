const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  photo: String,
  phone: String,
  email: { type: String, unique: true },
  gender: String
});

module.exports = mongoose.model("Student", studentSchema);
