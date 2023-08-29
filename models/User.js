const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
},{versionKey:false});

userSchema.pre('save', async function (next) {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;

});

module.exports = mongoose.model("User", userSchema);