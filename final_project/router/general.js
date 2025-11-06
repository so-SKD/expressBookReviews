const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if UN and PW are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required"});
  }

  // Check if user already exists
  let userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "User already exists"});
  }

  // Add new user
  users.push({ username: username, password: password });

  return res.status(200).json({ message: "User successfully registered. You can now log in."});
});

// GET the book list available in the shop
public_users.get('/',function (req, res) {
  //Route to get list of books using JSON.stringify
  res.send(JSON.stringify(books, null, 4));
});

// GET book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // get ISBN from URL
    const book = books[isbn];     // look it up in the books object

    if (book) {
        res.send(JSON.stringify(book, null, 4)); // send book details as JSON
    } else {
        res.status(404).json({ message: "Book not found" }); // handle invalid ISBN
    }
});
  
// GET book details based on author
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

// GET all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase(); // Make search case insensitive
    const matchedBooks = [];

    // Iterate through all books
    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title) {
            matchedBooks.push({ isbn, ...books[isbn] });
        }
    });

    if (matchedBooks.length > 0) {
        res.send(JSON.stringify(matchedBooks, null, 4)); // Return all matching books
    } else {
        res.status(404).json({ message: "Title not found" }); // Handle invalid Title
    }
});

//  GET book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Get ISBN from URL
  const book = books[isbn]; // Look up book by ISBN

  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));  // Send reviews 
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
