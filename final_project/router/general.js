const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// GET the book list available in the shop
public_users.get('/',function (req, res) {
  //Route to get list of books using JSON.stringify
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // get ISBN from URL
    const book = books[isbn];     // look it up in the books object

    if (book) {
        res.send(JSON.stringify(book, null, 4)); // send book details as JSON
    } else {
        res.status(404).json({ message: "Book not found" }); // handle invalid ISBN
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase(); // Make search case insensitive
    const matchedBooks = [];

    // Iterate through all books
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author) {
            matchedBooks.push({ isbn, ...books[isbn] });
        }
    });

    if (matchedBooks.length > 0) {
        res.send(JSON.stringify(matchedBooks, null, 4)); // Return all matching books
    } else {
        res.status(404).json({ message: "Author not found" }); // Handle invalid Author
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
