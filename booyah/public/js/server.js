const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require('path');

const COMMENTS_FILE = path.join(__dirname, '..', '..', 'comments_database', 'comments.json');

const app = express();  
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '..', 'views'));

const readComments = () => JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf8') || '[]');
const writeComments = (comments) => fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));

// Ensure the JSON file exists
if (!fs.existsSync(COMMENTS_FILE)) {
    writeComments([]);
}

// render comment route
app.get('/', (req, res) => {
  const comments = readComments();
  res.render('index', { comments });
});

// API route to get all comments
app.get('/comments', (req, res) => {
  const comments = readComments(); // Read comments from the JSON file
  res.json({ success: true, comments }); // Respond with JSON
});

// post route 
// add comment
app.post('/comments', (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
  }
  const comments = readComments();
  const newComment = { 
      id: comments.length + 1, 
      content: content.trim(), 
      timestamp: new Date().toISOString() 
  };
  comments.push(newComment);
  writeComments(comments);
  res.status(201).json({ success: true, comment: newComment });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});