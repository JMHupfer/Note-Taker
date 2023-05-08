const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;


    if (title && text) {

        const newNote = {
            title,
            text,
            note_id: uuidv4(),
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
                            `Note with title "${newNote.noteTitle}" has been written to JSON file`
                        );
                        const response = {
                            status: 'success',
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

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`app listening at http://localhost:${PORT}`)
);