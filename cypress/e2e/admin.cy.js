describe('test admin', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
        cy.get('.nav-link').contains('Login').click();
    });

    it('check if the "Adminstration" button exists on for admin accout', () => {
        cy.get('input[name="username"]').type("admin1")
        cy.get('input[name="password"]').type("Le#PetitChat1");

        cy.get('button').contains('Login').click();
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.nav-link').contains('Administration');
    });

    it('check if the "Adminstration" button doesn\'t exist for non-admin accout', () => {
        cy.get('input[name="username"]').type("cypress")
        cy.get('input[name="password"]').type("Le#petitChat1");

        cy.get('button').contains('Login').click();
        cy.url().should('eq', 'http://localhost:3000/');
        
        cy.get('.nav-link').should('not.contain', "Administration");
    });

    it('delete a user as administrator', () => {
        cy.get('input[name="username"]').type("admin1");
        cy.get('input[name="password"]').type("Le#PetitChat1");

        cy.get('button').contains('Login').click();
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.nav-link').contains('Administration').click();

        cy.contains('tr', 'cypress').find('button').click();
        cy.contains('button', 'Yes, Delete').click();
        cy.contains('tr', 'cypress').should('not.exist');
    })
})