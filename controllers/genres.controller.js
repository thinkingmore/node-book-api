const Genre = require('../models/Genre');

exports.getAllGenres = async (req, res, next) => {
  try {
    const genres = await Genre.find();
    res.status(200).json({ success: true, data: genres });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};
