import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";
import booksData from "./data/books.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


const { Schema } = mongoose;
const bookSchema = new Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

const Book = mongoose.model("Book", bookSchema);

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
  await Book.deleteMany()
  booksData.forEach((singleBook) => {
    const newBook = new Book (singleBook)
    newBook.save()
  })
}
resetDatabase()

}

// Start defining your routes here
app.get("/", (req, res) => {
res.json(listEndpoints(app));
});

app.get("/book/id/:id", async (req,res) => {
  try {
    const singleBook = await Book.findById(req.params.id)
    if (singleBook) {
      res.status(200).json({
        sucess: true,
        body: singleBook
      })
    } else {
      res.status(404).json({
        sucess: false,
        body: {
          message: "Sorry, book not found"
        }
      })
    }
  } catch(error) {
    res.status(500).json({
      sucess: false,
      body: {
        message: error
      }
    })
  }
})

app.get("/authors", async (req, res) => {
  const authors = await Author.find()

  res.json(authors);
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
