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

module.exports.saveABook = async (req, res, next) => {
  try {
    const book = req.body;

    const result = await db.collection("books").insertOne(book);
    console.log(result);

    if (!result.insertedId) {
      return res.status(400).send({ status: false, error: "Something went wrong!" });
    }

    res.send({ success: true, message: `book added with id: ${result.insertedId}` });
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

    const book = await db.collection("books").findOne({_id: ObjectId(id)});

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

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Not a valid book id." });
    }

    const book = await db.collection("books").updateOne({ _id: ObjectId(id) }, { $set: req.body });

    if (!book.modifiedCount) {
      return res.status(400).json({ success: false, error: "Couldn't update the book" });
    }

    res.status(200).json({ success: true, message: "Successfully updated the book" });
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

    const book = await db.collection("books").deleteOne({ _id: ObjectId(id) });

    if (!book.deletedCount) {
      return res.status(400).json({ success: false, error: "Couldn't delete the book" });
    }

    res.status(200).json({ success: true, message: "Successfully deleted the book" });
  } catch (error) {
    next(error);
  }
};
