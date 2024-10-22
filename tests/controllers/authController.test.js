// src/controllers/authController.test.js
const request = require('supertest');
const app = require('../../app'); // Ścieżka do pliku głównego aplikacji, np. app.js

describe('Auth Controller', () => {
    // Test dla rejestracji użytkownika
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('User registered successfully. Please check your email to activate your account.');
    });

    // Test dla logowania
    it('should log in a user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    // Test dla sprawdzania dostępności emaila
    it('should check email availability', async () => {
        const response = await request(app)
            .get('/api/auth/check-email/test@example.com');
        expect(response.statusCode).toBe(200);
        expect(response.body.available).toBe(true); // Zakładając, że email jest dostępny
    });
});