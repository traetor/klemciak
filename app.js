const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use('/uploads/avatars', express.static('uploads/avatars'));

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

const serverUrl = process.env.NODE_ENV === 'production'
    ? 'https://johnny-systems-backend.vercel.app'
    : `http://localhost:${process.env.PORT || 3001}`;

// CDN CSS
const CSS_URL = "https://johnny-systems.vercel.app/css/swagger-ui.min.css";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Johnny Systems API',
            version: '1.0.0',
            description: 'API documentation for the Task Manager App',
        },
        servers: [
            {
                url: serverUrl,
            },
        ],
    },
    apis: ['./routes/*.js'], // Upewnij się, że ścieżka jest poprawna
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL }));

app.get('/', (req, res) => {
    res.send('Welcome to the Task Manager App');
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// Uruchamiaj serwer tylko, jeśli nie jesteś w trybie testowym
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app; // Eksportuj aplikację dla testów