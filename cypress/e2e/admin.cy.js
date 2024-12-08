describe('test admin', () => {
    describe('tests with beforeEach', () => {
        beforeEach(() => {
            cy.visit('http://localhost:3000');
            cy.get('.nav-link').contains('Login').click();
        });

        it('check if the "Administration" button exists for admin account', () => {
            cy.get('input[name="username"]').type("admin1");
            cy.get('input[name="password"]').type("Le#PetitChat1");

            cy.get('button').contains('Login').click();
            cy.url().should('eq', 'http://localhost:3000/');

            cy.get('.nav-link').contains('Administration');
        });

        it('check if the "Administration" button doesn\'t exist for non-admin account', () => {
            cy.get('input[name="username"]').type("cypress");
            cy.get('input[name="password"]').type("Le#petitChat1");

            cy.get('button').contains('Login').click();
            cy.url().should('eq', 'http://localhost:3000/');

            cy.get('.nav-link').should('not.contain', "Administration");
        });
    });

    describe('delete a user as administrator', () => {
        before(() => {
            cy.visit('http://localhost:3000');
            cy.get('.nav-link').contains('Register').click();
            cy.get('input[name="username"]').type("CypressTestAdmin");
            cy.get('input[name="email"]').type("CypressTestAdmin@gmail.com");
            cy.get('input[name="password"]').type("Le#PetitChat1");
            cy.get('input[name="confirmPassword"]').type("Le#PetitChat1");
            cy.get('button').contains('Register').click();
            cy.get('.nav-link').contains('Login').click();
            cy.get('input[name="username"]').type("admin1");
            cy.get('input[name="password"]').type("Le#PetitChat1");
            cy.get('button').contains('Login').click();
            cy.url().should('eq', 'http://localhost:3000/');
            cy.get('.nav-link').contains('Administration').click();
        });

        it('delete a user as administrator', () => {
            cy.contains('tr', 'CypressTestAdmin').find('button').click();
            cy.contains('button', 'Yes, Delete').click();
            cy.contains('tr', 'CypressTestAdmin').should('not.exist');
        });
    });
});
