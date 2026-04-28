// runbackend node server.js
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const setupSwagger = require('./swagger')


const app = express()
app.use(cors())
app.use(express.json())

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        cb(null, uniqueName + ext)
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed'))
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
})


const DB_FILE = './db.json'
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE))
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))

// POST upload image
app.use(cors())

// ต้องมาก่อน json parser
app.post('/upload', upload.single('cover'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' })
    }
    const coverUrl = `http://localhost:3001/uploads/${req.file.filename}`
    res.json({ url: coverUrl })
})

// ค่อย parse JSON สำหรับ API อื่น
app.use(express.json())


/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: search title or author
 *     responses:
 *       200:
 *         description: List of books
 */
// GET all books (with optional search)
app.get('/books', (req, res) => {
    const db = readDB()
    let books = db.books
    const { search } = req.query

    if (search) {
        const s = search.toLowerCase()
        books = books.filter(b =>
            b.title.toLowerCase().includes(s) ||
            b.author.toLowerCase().includes(s)
        )
    }
    res.json(books)
})

// GET book by id
app.get('/books/:id', (req, res) => {
    const db = readDB()
    const book = db.books.find(b => b.id == req.params.id)
    res.json(book)
})

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Book created
 */
// POST add book
app.post('/books', (req, res) => {
    const db = readDB()

    const lastId = db.books.length > 0
        ? Math.max(...db.books.map(b => b.id))
        : 0

    const newBook = {
        id: lastId + 1,
        ...req.body
    }

    db.books.push(newBook)
    writeDB(db)
    res.json(newBook)
})


/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               cover:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated
 */
// PUT update book
app.put('/books/:id', (req, res) => {
    const db = readDB()
    const index = db.books.findIndex(b => b.id == req.params.id)
    db.books[index] = { ...db.books[index], ...req.body }
    writeDB(db)
    res.json(db.books[index])
})

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted
 */
// DELETE book
app.delete('/books/:id', (req, res) => {
    const db = readDB()
    db.books = db.books.filter(b => b.id != req.params.id)
    writeDB(db)
    res.json({ success: true })
})

setupSwagger(app)
app.listen(3001, () => console.log('API running on http://localhost:3001'))