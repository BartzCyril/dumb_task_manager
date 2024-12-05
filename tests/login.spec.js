const { seedDatabase } = require('../config/seed-memory-database')

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
                expect(data.id).toBe(1);
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
})