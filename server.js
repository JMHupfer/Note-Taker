//the require code is importing all the modules listed after require
const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

//used to create an express instance, important for later code to app.set, app.use, app.get and app.post, app.delete, etc. 
const app = express();
// const PORT = 3001;

//using this code instead of const PORT to see if it will help launch heroku (env = enviroment)/specific for heroku
app.set('port', process.env.PORT || 3001);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json('Error reading notes');
        }
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;


    if (title && text) {

        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const parsedNotes = JSON.parse(data);
                parsedNotes.push(newNote);

                fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes), (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(
                            `Note with title "${newNote.title}" has been written to JSON file`
                        );
                        const response = {
                            status: 'It works!',
                            body: newNote,
                        };
                        console.log(response);
                        res.status(201).json(response);
                    }
                });
            }
        });
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json('Error reading notes');
        }

        const parsedNotes = JSON.parse(data);
        const updatedNotes = parsedNotes.filter((note) => note.id !== noteId);

        fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json('Error writing notes');
            }

            console.log(`Note with ID ${noteId} has been removed`);
            res.status(200).json({ status: 'success', note_id: noteId });
        });
    });
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`app listening at http://localhost:${PORT}`)
);