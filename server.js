require("dotenv").config()
const express = require("express")
const bookRoutes = require("./routes/v1/books.routes")
const cors = require("cors")
const app = (express())
const dbConnect = require("./utils/dbConnect");
const port = process.env.PORT || 5000
const errorHandler = require("./middleware/errorHandler")

// middleware 
app.use(express.json())
app.use(cors())
app.use(errorHandler);

dbConnect()
  
// routes for books
app.use("/api/v1/books", bookRoutes);


// default route for the routes that doesn't exist
app.all("*", (req, res) => {
    res.send("NO route found.");
  });


app.listen(port,()=>console.log(`Book list api running on ${port}`))

