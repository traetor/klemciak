const request = require('supertest');
const app = require('../../app'); // Ścieżka do pliku głównego aplikacji

describe('Notes Controller', () => {
    let token;

    // Przed testami: zaloguj się i uzyskaj token
    beforeAll(async () => {
        const response = await request(app)
            .post('/api/auth/login') // Zaktualizowana ścieżka logowania
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        token = response.body.token;
    });

    // Test tworzenia notatki
    it('should create a new note', async () => {
        const response = await request(app)
            .post('/api/notes') // Zaktualizowana ścieżka
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Note',
                content: 'This is a test note.',
                status: 'active'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('title', 'Test Note');
    });

    // Test pobierania notatek
    it('should get all notes', async () => {
        const response = await request(app)
            .get('/api/notes') // Zaktualizowana ścieżka
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});