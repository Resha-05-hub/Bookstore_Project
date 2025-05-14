const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let books = [
    { isbn: "20061", title: "Book One", author: "Author R", reviews: [] },
    { isbn: "20031", title: "Book Two", author: "Author D", reviews: [] }
];

// Task 1: Get the book list available in the shop
app.get("/books", (req, res) => {
    res.json(books);
});

// Task 2: Get books based on ISBN
app.get("/books/isbn/:isbn", (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json(book) : res.status(404).send("Book not found");
});

// Task 3: Get all books by an author
app.get("/books/author/:author", (req, res) => {
    const filteredBooks = books.filter(b => b.author === req.params.author);
    filteredBooks.length ? res.json(filteredBooks) : res.status(404).send("No books found for this author");
});

// Task 4: Get books based on title
app.get("/books/title/:title", (req, res) => {
    const filteredBooks = books.filter(b => b.title.includes(req.params.title));
    filteredBooks.length ? res.json(filteredBooks) : res.status(404).send("No books found with this title");
});

// Task 5: Get book review
app.get("/books/review/:isbn", (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json(book.reviews) : res.status(404).send("No reviews found");
});

// Task 6: Register new user
let users = [];
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).send("User already exists");
    }
    users.push({ username, password });
    res.status(201).send("User registered successfully");
});

// Task 7: Login as a registered user
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    user ? res.send("Login successful") : res.status(401).send("Invalid credentials");
});

// Task 8: Add/Modify a book review (Only registered users)
app.post("/books/review/:isbn", (req, res) => {
    const { username, review } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        book.reviews.push({ username, review });
        res.send("Review added successfully");
    } else {
        res.status(404).send("Book not found");
    }
});

// Task 9: Delete book review added by that user
app.delete("/books/review/:isbn", (req, res) => {
    const { username } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        book.reviews = book.reviews.filter(r => r.username !== username);
        res.send("Review deleted");
    } else {
        res.status(404).send("Book not found");
    }
});

// Task 10: Get all books using async callback
const getAllBooks = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books);
        }, 1000);
    });
};

app.get("/async-books", async (req, res) => {
    try {
        const bookList = await getAllBooks();
        res.json(bookList);
    } catch (error) {
        res.status(500).send("Error fetching books");
    }
});

// Task 11: Search by ISBN using Promises
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books.find(b => b.isbn === isbn);
        book ? resolve(book) : reject("Book not found");
    });
};

app.get("/promise-books/isbn/:isbn", (req, res) => {
    getBookByISBN(req.params.isbn)
        .then(book => res.json(book))
        .catch(err => res.status(404).send(err));
});

// Task 12: Search by Author using Async/Await
const getBooksByAuthor = async (author) => {
    return books.filter(b => b.author === author);
};

app.get("/async-books/author/:author", async (req, res) => {
    try {
        const authorBooks = await getBooksByAuthor(req.params.author);
        res.json(authorBooks);
    } catch (error) {
        res.status(500).send("Error fetching books by author");
    }
});

// Task 13: Search by Title using Async/Await
const getBooksByTitle = async (title) => {
    return books.filter(b => b.title.includes(title));
};

app.get("/async-books/title/:title", async (req, res) => {
    try {
        const titleBooks = await getBooksByTitle(req.params.title);
        res.json(titleBooks);
    } catch (error) {
        res.status(500).send("Error fetching books by title");
    }
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
