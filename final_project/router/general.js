const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();
const axios = require('axios');

// POST - User Registration
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

// GET Function to fetch books async-await w/ axios
public_users.get('/', async function (req, res) {
    try {
        res.send(JSON.stringify(books, null, 4));  // Return all books
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching books list" });
    }
});

// GET book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Book details by ISBN using Promises
    new Promise((resolve, reject) => {
        const bookDetails = books[isbn];
        if (bookDetails) {
            resolve(bookDetails);  
        } else {
            reject(new Error('Book not found'));  
        }
    })
    .then(bookDetails => {
        res.send(JSON.stringify(bookDetails, null, 4));  // Send the book details
    })
    .catch(error => {
        res.status(404).json({ message: "Book not found" });
    });
});

// GET books based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const matchedBooks = [];

    // Search using a Promise
    new Promise((resolve, reject) => {
        Object.keys(books).forEach((isbn) => {
            if (books[isbn].author.toLowerCase() === author) {
                matchedBooks.push({ isbn, ...books[isbn] });
            }
        });

        if (matchedBooks.length > 0) {
            resolve(matchedBooks);  // Resolve with the matched books
        } else {
            reject(new Error('Author not found'));  // Reject if no books are found
        }
    })
    .then(matchedBooks => {
        res.send(JSON.stringify(matchedBooks, null, 4));  // Send matched books
    })
    .catch(error => {
        res.status(404).json({ message: "Author not found" });
    });
});

// GET books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const matchedBooks = [];

    // Search using a Promise
    new Promise((resolve, reject) => {
        Object.keys(books).forEach((isbn) => {
            if (books[isbn].title.toLowerCase() === title) {
                matchedBooks.push({ isbn, ...books[isbn] });
            }
        });

        if (matchedBooks.length > 0) {
            resolve(matchedBooks);  // Resolve with the matched books
        } else {
            reject(new Error('Title not found'));  // Reject if no books are found
        }
    })
    .then(matchedBooks => {
        res.send(JSON.stringify(matchedBooks, null, 4));  // Send matched books
    })
    .catch(error => {
        res.status(404).json({ message: "Title not found" });
    });
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