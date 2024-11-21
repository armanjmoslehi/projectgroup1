const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();  // Initialize express application 

app.use(bodyParser.json());  // Middlewares parse incoming requests & enable CORS  

app.use(cors());

let posts=[];   /// Array where store submitted user-generated notes/posts temporarily only till process restarts...
// POST route to handle adding new posts

app.post('/api/post_text', (req, res) => {
  const { content } = req.body; // Extract the `content` field from the request body

  // Validate the input
  if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Invalid content' });
  }

  posts.push(content.trim()); // Add the new post to the `posts` array
  res.status(200).json({ message: 'Post added successfully' }); // Send success response
});

app.get('/api/post_text',(req,res)=>{

  res.json(posts);          /// Simply returning JSON response containing array current collection ; )

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});