module.exports = {
    testEnvironment: 'node', // dla aplikacji Node.js
    roots: ['<rootDir>/tests'], // katalog z testami
    testMatch: ['**/?(*.)+(spec|test).js'], // wzorce nazw plików testowych
    verbose: true, // szczegółowe raportowanie
};