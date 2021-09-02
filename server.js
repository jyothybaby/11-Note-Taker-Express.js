//Importing the requirements
const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const app = express();
const PORT = 3001;
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Invoke app.use() and serve static files from the '/public' folder
app.use(express.static("public"));
//Get route for Homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// Get route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// Get routes for Wildcard route
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get("/",(req,res) => {
  readFromFile( "./db/db.json").then((data)=> res.json(JSON.parse(data)));
})
// create new notes
fb.post('/', (req, res) => {
  const {noteTitle, noteText } = req.body;
  if(noteTitle && noteText) {
    const newNoteTake = {
      noteTitle,
      noteText,
      noteTextId : uuid()
    };
    fs.readFile("./db/db.json", "utf8", (err,data) => {
      if(err){
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNoteTake);
        fs.writeFile("./db/db.json",JSON.stringify(parsedNotes),(err) =>
        err ? console.error(err): console.log("updated the content")
        ))
      }
    })
  }
 })








app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
