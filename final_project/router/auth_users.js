const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();
let users = []; // registered users

// Check if username exists
const isValid = (username) => users.some(user => user.username === username);

// Authenticate user
const authenticatedUser = (username, password) => users.some(user => user.username === username && user.password === password);

// Middleware to verify JWT/session
const verifyJWT = (req, res, next) => {
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
};

// Login route (public)
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });

        req.session.authorization = { accessToken, username };

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid login. Check username and password" });
    }
});

// Add/modify a book review (protected)
regd_users.put("/review/:isbn", verifyJWT, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;        // review passed in query string
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

// Delete a book review (own not others)
regd_users.delete("/review/:isbn", verifyJWT, (req,res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review delete successfully", reviews: books[isbn].reviews });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
