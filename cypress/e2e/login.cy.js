describe('test register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('.nav-link').contains('Login').click();
    });

    it('login with good credentials', () => {
        cy.get('input[name="username"]').type("cypress");
        cy.get('input[name="password"]').type("Le#petitChat1");

        cy.get('button').contains('Login').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('login with invalid credentials', () => {
        cy.get('input[name="username"]').type("cypredddss2");
        cy.get('input[name="password"]').type("Le#pezqdzqdtitChzqdzqdat1");

        cy.get('button').contains('Login').click();
        cy.get('#AuthForm-error-global').contains("Le nom d'utilisateur ou le mot de passe est incorrect");
    });

    it('Go to the register page', () => {
        cy.get('a').contains('Register').click();
        cy.url().should('eq', 'http://localhost:3000/auth/register');
    });
})