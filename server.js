//Importing the requirements
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');
const api = require("index.js")

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

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
 const writeToFile = (destination, content) =>
 fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
   err ? console.error(err) : console.info(`\nData written to ${destination}`)
 );

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
// GET Route for retrieving all the tips
app.get("/api/notes",(req,res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile( "./db/db.json").then((data)=> res.json(JSON.parse(data)));
})
// create new notes
app.post("/api/notes",(req, res) => {
  console.info(`${req.method} request received to add a note`);
  const {noteTitle, noteText } = req.body;
  if(noteTitle && noteText) {
    const newNoteTake = {
      noteTitle,
      noteText,
      noteTextId : uuid()
    };

    readAndAppend(newNoteTake, "./db/db.json")
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("error in adding Notes")
  }

});
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
