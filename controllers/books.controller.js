const { ObjectId } = require("mongodb");
const Book = require("../models/Book");
const Genre = require('../models/Genre'); 

module.exports.getAllBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) -1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "rating";
    let genre = req.query.genre || "All";

   // Fetch genres from the database
   const genresCollection = await Genre.find();

   // Map the genre names from the fetched genres
   const genreOptions = genresCollection.map(genre => genre.name);


		genre === "All"
			? (genre = [...genreOptions])
			: (genre = req.query.genre.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);


		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const books = await Book.find({ title: { $regex: search, $options: "i" } })
			.where("genre")
			.in([...genre])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

    const total = await Book.countDocuments({
      genre: {$in: [...genre]},
      title: {$regex: search, $options: "i"},
    });    

    const result = {
      error: false,
      total,
      page: page + 1,
      limit,
      genres: genreOptions,
      books
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: true, message: "Internal Server Error"})
  }
};


module.exports.addABook = async (req, res, next) => {
  try {
    const bookData = req.body; // Assuming the request body contains book data

    const book = new Book(bookData); // Create a new instance of the Book model
    const savedBook = await book.save(); // Save the book to the database

    if (!savedBook) {
      return res.status(400).send({ success: false, error: "Something went wrong!" });
    }

    res.status(201).send({ success: true, message: `Book added with id: ${savedBook._id}` });
  } catch (error) {
    next(error);
  }
};


module.exports.getBookDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    if(!ObjectId.isValid(id)){
      return res.status(400).json({ success: false, error: "Not a valid book id."});
    }

    const book = await Book.findOne({ _id: id });

    if(!book){
      return res.status(400).json({ success: false, error: "Couldn't find a book with this id"});
    }

    res.status(200).json({ success: true, data: book });
    
  } catch (error) {
    next(error);
  }
};

module.exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, published, rating } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Not a valid book id.' });
    }

    const book = await Book.findOneAndUpdate(
      { _id: id },
      { title, author, published, rating },
      { new: true }
    );

    if (!book) {
      return res.status(400).json({ success: false, error: "Couldn't find a book with this id" });
    }

    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};


module.exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Not a valid book id." });
    }

    const deletedBook = await Book.findOneAndDelete({ _id: id });

    if (!deletedBook) {
      return res.status(400).json({ success: false, error: "Couldn't delete the book" });
    }

    res.status(200).json({ success: true, message: "Successfully deleted the book" });
  } catch (error) {
    next(error);
  }
};

