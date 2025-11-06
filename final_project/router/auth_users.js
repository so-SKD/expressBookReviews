const express = require('express'); // Import the Express.js library
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // List of registered users

// Check if the user exists
const isValid = (username)=>{ 
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
};

// Check if the username and PW match
const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    return validusers.length >0;
};

// Middleware to authenticate users using JWT
const verifyJWT = (req, res, next) => {
    if (req.session.authorization) { // Get the authorization object stored in the session
      const token = req.session.authorization.accessToken; // Retrieve the token from authorization object
      jwt.verify(token, "access", (err, user) => { // Use JWT to verify token
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
  
//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            { data: username },
            "access",
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken, username
        };

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
