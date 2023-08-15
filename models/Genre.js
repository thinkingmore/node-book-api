const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, unique: true },
},{versionKey:false});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
