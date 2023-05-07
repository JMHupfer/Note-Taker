const express = require('express');
const path = require('path');
const notesData = require('./db/db.json');
const uuid = require('uuid');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => res.json(notesData));

// app.post('/api/notes', (req, res) => {
//     res.json(`${req.method} request received`);

//     console.info(req.rawHeaders);

//     console.info(`${req.method} request received`);
// });

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { noteTitle, noteText } = req.body;


    if (noteTitle && noteText) {

        const newNote = {
            noteTitle,
            noteText,
            note_id: uuid(),
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
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