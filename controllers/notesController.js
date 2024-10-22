const Note = require('../models/Note');

exports.createNote = (req, res) => {
    const { title, content, status } = req.body;
    const userId = req.user.id; // zakładam, że masz middleware, który ustawia req.user

    Note.create({ title, content, status, user_id: userId }, (err, note) => {
        if (err) {
            console.error('Error creating note:', err);
            return res.status(500).send({ message: 'Error creating note' });
        }
        res.status(201).send(note);
    });
};

exports.getNotes = (req, res) => {
    const userId = req.user.id;

    Note.findByUser(userId, (err, notes) => {
        if (err) {
            console.error('Error fetching notes:', err);
            return res.status(500).send({ message: 'Error fetching notes' });
        }
        res.send(notes);
    });
};

exports.updateNote = (req, res) => {
    const { id } = req.params;
    const { title, content, status } = req.body;

    Note.update(id, { title, content, status }, (err, note) => {
        if (err) {
            console.error('Error updating note:', err);
            return res.status(500).send({ message: 'Error updating note' });
        }
        if (!note) {
            return res.status(404).send({ message: 'Note not found' });
        }
        res.send(note);
    });
};

exports.deleteNote = (req, res) => {
    const { id } = req.params;

    Note.delete(id, (err, success) => {
        if (err) {
            console.error('Error deleting note:', err);
            return res.status(500).send({ message: 'Error deleting note' });
        }
        if (!success) {
            return res.status(404).send({ message: 'Note not found' });
        }
        res.send({ message: 'Note deleted successfully' });
    });
};
