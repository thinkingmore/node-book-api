const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.json({ status: false, message: 'Authentication failed: Token missing' })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  })
}

module.exports = verifyJWT;