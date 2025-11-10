const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();
const axios = require('axios');

// Function to fetch books async-await w/ axios
async function fetchBooksByISBN(isbn) {
    try {
        const response = await axios.get("https://sarah1234520-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
        console.log("API Response:", response.data); 
        return response.data; // Return book details
    } catch (error) {
        console.error("Error fetching books by ISBN:", error);
    }
}

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

// GET the book list available in the shop
public_users.get('/',function (req, res) {
  //Route to get list of books using JSON.stringify
  res.send(JSON.stringify(books, null, 4));
});

// GET book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Book details by ISBN using Promises
    new Promise((resolve, reject) => {
        const bookDetails = books[isbn];
        if (bookDetails) {
            resolve(bookDetails);  // Resolve with book details
        } else {
            reject(new Error('Book not found'));  // Reject if no book is found
        }
    })
    .then(bookDetails => {
        res.send(JSON.stringify(bookDetails, null, 4));  // Send the book details
    })
    .catch(error => {
        res.status(404).json({ message: "Book not found" });
    });
});
  
// GET book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase(); // Make search case insensitive
    const matchedBooks = [];

    try {
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
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase(); // Make search case insensitive
    const matchedBooks = [];

    try {
        if (!title) { // If no title is provided
            return res.status(400).json({ message: "Title is required" });
        }
        
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
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
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
