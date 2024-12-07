const createTask = () => {
    cy.get('button').contains('Add a Task').click();
    cy.wait(500);
    cy.get('input[name="title"]').type("Faire des lasagnes");
    cy.get('textarea[name="description"]').type("Acheter des pâtes, de la viande, de la sauce tomate et du fromage");
    cy.get('button').contains('Add Task').click();
};

const editTask = () => {
    cy.get('#todo-list li button').contains('Edit').click();
    cy.get('input[name="title"]').should('have.value', 'Faire des lasagnes');
    cy.get('textarea[name="description"]').should('have.value', 'Acheter des pâtes, de la viande, de la sauce tomate et du fromage');
    cy.wait(500);
    cy.get('input[name="title"]').type(' et des cannellonis');
    cy.get('button').contains('Modify Task').click();
};

const login = () => {
    cy.get('.nav-link').contains('Login').click();
    cy.get('input[name="username"]').type("cypress");
    cy.get('input[name="password"]').type("Le#petitChat1");
    cy.get('button').contains('Login').click();
    cy.url().should('eq', 'http://localhost:3000/');
};

describe('test register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('create task if the user is not connected and verify that the task has been created', () => {
        createTask();
        cy.get('#todo-list li').should('have.length', 1);
        cy.get('#todo-list li div').contains('Faire des lasagnes');
    });

    it('create task if the user is not connected and verify that the task has been created and we can deleted this task', () => {
        createTask();
        cy.get('#todo-list li').should('have.length', 1);
        cy.get('#todo-list li div').contains('Faire des lasagnes');
        cy.get('#todo-list li button').contains('Delete').click();
        cy.get('#todo-list li').contains('No tasks found. Add a new task!');
    });

    it('create task if the user is not connected and verify that the task has been created and we can edit this task', () => {
        createTask();
        cy.get('#todo-list li').should('have.length', 1);
        cy.get('#todo-list li div').contains('Faire des lasagnes');
        editTask();
        cy.get('#todo-list li').should('have.length', 1);
        cy.get('#todo-list li div').contains('Faire des lasagnes et des cannellonis');
    });

    it('create task if the user is not connected and verify that the task has been created and we can mark this task as completed', () => {
        createTask();
        cy.get('#todo-list li').should('have.length', 1);
        cy.get('#todo-list li div').contains('Faire des lasagnes');
        cy.get('#todo-list li input').click();
        cy.get('#todo-list li').should('have.class', 'completed-task');
    });

    it('create task if the user is not connected and verify that the task has been created and we can mark this task as completed and uncompleted', () => {
        createTask();
        cy.get('#todo-list li').should('have.length', 1);
        cy.get('#todo-list li div').contains('Faire des lasagnes');
        cy.get('#todo-list li input').click();
        cy.get('#todo-list li').should('have.class', 'completed-task');
        cy.get('#todo-list li input').click();
        cy.get('#todo-list li').should('not.have.class', 'completed-task');
    });

    it('create task if the user is not connected and verify that the task have been created after reloading the page', () => {
        createTask();
        cy.reload();
        cy.get('#todo-list li').should('have.length', 1);
        cy.get('#todo-list li div').contains('Faire des lasagnes');
    });

    it('create task if the user is not connected and verify that the task have been saved in the database when the user is connected', () => {
        createTask();
        cy.get('.nav-link').contains('Login').click();
        cy.get('input[name="username"]').type("cypress");
        cy.get('input[name="password"]').type("Le#petitChat1");
        cy.get('button').contains('Login').click();
        cy.url().should('eq', 'http://localhost:3000/');
        cy.get('#todo-list li div').contains('Faire des lasagnes');
    });

    it('"create a task if the user is not connected, and verify that the task is saved in the database when the user connects. Ensure that no tasks appear when the user disconnects', () => {
        createTask();
        login();
        cy.get('#todo-list li div').contains('Faire des lasagnes');
        cy.get('.nav-link').contains('Logout').click();
        cy.get('#todo-list li').should('have.length', 1);
        cy.get('#todo-list li').contains('No tasks found. Add a new task!');
    });

    it('create a task if the user is connected and we can edit this task', () => {
        login();
        createTask();
        cy.get('#todo-list li div').contains('Faire des lasagnes');
        editTask();
        cy.get('#todo-list li div').contains('Faire des lasagnes et des cannellonis');
    });
    
    it('create a task if the user is connected and we can mark this task as completed and uncompleted', () => {
        login();
        createTask();
        cy.get('#todo-list li div').contains('Faire des lasagnes');
        cy.get('#todo-list li input').first().click();
        cy.get('#todo-list li').should('have.class', 'completed-task');
        cy.get('#todo-list li input').first().click();
        cy.get('#todo-list li').should('not.have.class', 'completed-task');
    });

    it('delete all tasks if the user is connected', () => {
        login();
        cy.get('#todo-list li').then((tasks) => {
            const taskCount = tasks.length;
            for (let i = 0; i < taskCount; i++) {
                cy.get('#todo-list li button').contains('Delete').click();
            }
        });
        cy.get('#todo-list li').contains('No tasks found. Add a new task!');
    });
});