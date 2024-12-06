describe('test register', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');

    cy.get('.nav-link').contains('Register').click();
  });

  it('register with good credentials', () => {
    cy.get('input[name="username"]').type("cypress");
    cy.get('input[name="email"]').type("cypress@test.com");
    cy.get('input[name="password"]').type("Le#petitChat1");
    cy.get('input[name="confirmPassword"').type("Le#petitChat1");

    cy.get('button').contains('Register').click();
    cy.url().should('eq', 'http://localhost:3000/auth/login');
  });

  it('Return error if the username already exist', () => {
    cy.get('input[name="username"]').type("cypress");
    cy.get('input[name="email"]').type("cypress2@test.com");
    cy.get('input[name="password"]').type("Le#petitChat1");
    cy.get('input[name="confirmPassword"').type("Le#petitChat1");

    cy.get('button').contains('Register').click();
    cy.get('#AuthForm-error-global').contains("L'utilisateur cypress existe déjà")
  });

  it('Return error if the email address already exist', () => {
    cy.get('input[name="username"]').type("cypress2");
    cy.get('input[name="email"]').type("cypress@test.com");
    cy.get('input[name="password"]').type("Le#petitChat1");
    cy.get('input[name="confirmPassword"').type("Le#petitChat1");

    cy.get('button').contains('Register').click();
    cy.get('#AuthForm-error-global').contains("L'adresse mail cypress@test.com existe déjà");
  });

  it('Must return an error if username doesn\'t respect criteria', () => {
    cy.get('input[name="username"]').type("cypress 2");
    cy.get('#AuthForm-error-username').contains("Username can only contain letters, numbers, underscores, and hyphens");
  });

  it('Must return an error if password isn\'t long enough', () => {
    cy.get('input[name="password"]').type("test");
    cy.get('#AuthForm-error-password').contains("Password must be at least 8 characters long");
  });

  it('Must return an error if password doesn\'t contain at least one uppercase letter', () => {
    cy.get('input[name="password"]').type("eeeeeeeeeeeeeeeeee");
    cy.get('#AuthForm-error-password').contains("Password must contain at least 1 uppercase letter");
  });

  it('Must return an error if password doesn\'t contain at least one lowercase letter', () => {
    cy.get('input[name="password"]').type("EEEEEEEEEEEEEEEEEE");
    cy.get('#AuthForm-error-password').contains("Password must contain at least 1 lowercase letter");
  });

  it('Must return an error if password doesn\'t contain at least one number', () => {
    cy.get('input[name="password"]').type("EeEeEeEeEeEeEeEe");
    cy.get('#AuthForm-error-password').contains("Password must contain at least 1 number");
  });

  it('Must return an error if password doesn\'t contain at least one special character', () => {
    cy.get('input[name="password"]').type("EeEeEeEeEeEeEeE2");
    cy.get('#AuthForm-error-password').contains("Password must contain at least 1 special character");
  });

  it('Must return an error if password and confirm password don\'t match', () => {
    cy.get('input[name="password"]').type("Le#PetitChat1");
    cy.get('input[name="confirmPassword"]').type("Le#PetitChat2");
    cy.get('#AuthForm-error-password').contains("Passwords do not match");
    cy.get('#AuthForm-error-confirmPassword').contains("Passwords do not match");
  });
})