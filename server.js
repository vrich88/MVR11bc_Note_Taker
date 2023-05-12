// Required dependencies & imports for app
// express
const express = require("express");
// file system
const fs = require("fs");
// path
const path = require("path");
// database
const db = require("./db/db.json");
// uuid = unique id
const { v4: uuidv4 } = require("uuid");
// port & app set up/initialization
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware making data format for express to filter through
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// Routes
// index.html home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// notes.html page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
// api get notes
app.get("/api/notes", (req, res) => {
  res.json(db);
});
// api post notes & update database ... can we make these notes editable?
app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    title: title,
    text: text,
    id: uuidv4(),
  };
  let changedDB = db;
  changedDB.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(changedDB)
  );
  const newNoteState = {
    status: "Notepad updated successfully",
    body: newNote,
  };
  res.json(newNoteState);
});
// api delete notes
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  for (let i = 0; i < db.length; i++) {
    if (db[i].id === id) {
      db.splice(i, 1);
    }
  }
  fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(db));
  res.send(`Note ${id} removed successfully`);
});

// Server start up & verification in console log
app.listen(PORT, () =>
  console.log(`Start writing notes at http://localhost:${PORT}`)
);
