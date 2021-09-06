//Importing the requirements
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const util = require('util');
const notesjs = require('./db/db.json');
const app = express();

//Declaring the PORT Number
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Invoke app.use() and serve static files from the '/public' folder
app.use(express.static("public"));

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
 const writeToFile = (destination, content) =>
 fs.writeFile(destination, JSON.stringify(content, null, 2), (err) =>
   err ? console.error(err) : console.info(`\nData written to ${destination}`)
 );

 /**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */

 const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

// GET Route for retrieving all the notes
app.get("/api/notes",(req,res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile( "./db/db.json").then((data)=> res.json(JSON.parse(data)));
  console.info("Read db.json")
});

// Create new notes
app.post("/api/notes",(req, res) => {
  console.info(`${req.method} request received to add a note`);
  const {  title, text } = req.body;
  if (req.body) {
    const newNote = {
      title,
      text,
      id : uuid()
    };

    readAndAppend(newNote, "./db/db.json")
    res.json(`Note added successfully 🚀`);
  } else {
    res.json("error in adding Notes")
  }

});

//Delete the note: for deleting the note, we need to specify the id of the note which we are going to delete.

app.delete('/api/notes/:id', (req, res) => {
  console.info("in the delete section");
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((notesjs) => notesjs.id !== noteId);
      // Save that array to the filesystem
      writeToFile('./db/db.json', result);
      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

// Get route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// Get routes for Wildcard route
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
