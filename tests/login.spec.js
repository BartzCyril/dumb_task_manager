const { seedDatabase } = require('../config/seed-memory-database')

jest.mock('jsonwebtoken');

beforeAll(async () => {
    await seedDatabase();
})

/* Tests unitaires */
const User = require('../models/user')

describe("Tests unitaires pour login", () => {
    test('Se connecter à un utilisateur avec les bons credentials', done => {
        function callback(err, data){
            if(err) {
                done(err);
                return;
            }
            try{
                expect(data.id).toBe(2);
                expect(data.username).toBe("user1");
                expect(data.email).toBe("user1@example.com");
                expect(data.connected).toBe(true)
                done();
            } catch(err) {
                done(err);
            }
        }
        User.authenticate("user1", "password1", callback)
    });

    test('Se connecter à un utilisateur qui n\'existe pas', done => {
        function callback(err, data){
            if(err) {
                done(err);
                return;
            }
            try{
                expect(data.connected).toBe(false);
                done();
            } catch(err) {
                done(err);
            }
        }

        User.authenticate("user", "password1", callback)
    });

    test('Se connecter à un utilisateur avec un mot de passe incorrect', done => {
        function callback(err, data){
            if(err) {
                done(err);
                return;
            }
            try{
                expect(data.connected).toBe(false);
                done();
            } catch(err) {
                done(err);
            }
        }

        User.authenticate("user1", "password", callback)
    });
});

/* Tests fonctionnels */
const auth = require('../routes/auth');
const express = require("express");
const request = require("supertest");
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'ifgijddf<9394#39EDez',
    name: "session",
    cookie: {
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24,
    }
}));
app.use('/auth', auth);

describe('POST /auth/login', () => {
    it('should return 400 if username doesn\'t exist', async () => {
        const body = {
            username: "user",
            password: "password2"
        }
        const res = await request(app)
                    .post('/auth/login')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("Le nom d'utilisateur ou le mot de passe est incorrect")
    });

    it('should return 400 if password is incorrect', async () => {
        const body = {
            username: "user2",
            password: "password"
        }
        const res = await request(app)
                    .post('/auth/login')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("Le nom d'utilisateur ou le mot de passe est incorrect")
    });

    it('should return 200 if it\'s good credential', async () => {
        const body = {
            username: "user2",
            password: "password2"
        }
        const res = await request(app)
                    .post('/auth/login')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(200);
    });
})