const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const { authMiddleware } = require('../middlewares/authMiddleware');  // Importuj authMiddleware

// Dodaj middleware autoryzacji - authMiddleware

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for the logged-in user
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: A list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   status:
 *                     type: string
 *                   user_id:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, notesController.getNotes);

/**
 * @swagger
 * /api/notes/create:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My first note"
 *               content:
 *                 type: string
 *                 example: "This is the content of the note"
 *               status:
 *                 type: string
 *                 example: "ważne"
 *     responses:
 *       201:
 *         description: Note created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/create', authMiddleware, notesController.createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update an existing note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.put('/:id', authMiddleware, notesController.updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */
router.delete('/:id', authMiddleware, notesController.deleteNote);

module.exports = router;