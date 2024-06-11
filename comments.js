// Create web server

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Create web server
const app = express();
app.use(bodyParser.json());

// Read comments from file
const comments = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'comments.json')));

// Create new comment
app.post('/comments', (req, res) => {
  const comment = req.body;
  comment.id = comments.length + 1;
  comments.push(comment);
  fs.writeFileSync(path.resolve(__dirname, 'comments.json'), JSON.stringify(comments));
  res.status(201).json(comment);
});

// Get all comments
app.get('/comments', (req, res) => {
  res.json(comments);
});

// Get comment by id
app.get('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comment = comments.find(comment => comment.id === id);
  if (comment) {
    res.json(comment);
  } else {
    res.status(404).json({ error: 'Comment not found' });
  }
});

// Update comment by id
app.put('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const comment = comments.find(comment => comment.id === id);
  if (comment) {
    Object.assign(comment, req.body);
    fs.writeFileSync(path.resolve(__dirname, 'comments.json'), JSON.stringify(comments));
    res.json(comment);
  } else {
    res.status(404).json({ error: 'Comment not found' });
  }
});

// Delete comment by id
app.delete('/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = comments.findIndex(comment => comment.id === id);
  if (index !== -1) {
    comments.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, 'comments.json'), JSON.stringify(comments));
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Comment not found' });
  }
});

// Start web server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});