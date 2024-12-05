const User = require('../models/user')

test('Récupère tous les utilisateur', done => {
    function callback(err, data) {
        if(err) {
            done(err);
            return;
        }
        try {
            expect(data.length).toBe(4);
            done();
        } catch (err) {
            done(err);
        }
    }

    User.getAllUsers(callback)
});

test('Récupère un utilisateur en fonction de son username', done => {
    function callback(err, data) {
        if(err) {
            done(err);
            return;
        }
        try {
            expect(data.id).toBe(9);
            expect(data.username).toBe("user1")
            expect(data.email).toBe("user1@example.com")
            done();
        } catch (err) {
            done(err);
        }
    }

    User.findUserByUsername("user1", callback)
});


test('Récupère un utilisateur en fonction de son username qui n\'existe pas', done => {
    function callback(err, data) {
        if(err) {
            done(err);
            return;
        }
        try {
            expect(data).toBe(undefined)
            done();
        } catch (err) {
            done(err);
        }
    }


    User.findUserByUsername("user4", callback)
});

test('Récupère un utilisateur en fonction de son adresse mail', done => {
    function callback(err, data) {
        if(err) {
            done(err);
            return;
        }
        try {
            expect(data.id).toBe(10);
            expect(data.username).toBe("user2");
            expect(data.email).toBe("user2@example.com");
            done();
        } catch (err) {
            done(err);
        }
    }

    User.findUserByEmail("user2@example.com", callback)
});

test('Récupère un utilisateur en fonction de son adresse mail qui n\'existe pas', done => {
    function callback(err, data) {
        if(err) {
            done(err);
            return;
        }
        try {
            expect(data).toBe(undefined)
            done();
        } catch (err) {
            done(err);
        }
    }


    User.findUserByUsername("user4", callback)
});