// https://docs.cypress.io/api/introduction/api.html

describe('', () => {
  const username = 'cypressuser';
  const password = 'topsecret';

  after(() => {
    // Delete created user using requests to API
  });

  it('Performs sign up', () => {
    // Spy on POST requests to /users endpoint
    cy.server();
    cy.route({
      method: 'POST',
      url: '/users'
    }).as('new-user');

    cy.visit('localhost:8080/');

    // Open sign up form
    cy.contains('button', 'Sign up')
      .first()
      .click();

    // Fill in form data
    cy.contains('div', 'Username')
      .find('input')
      .first()
      .type(username);
    cy.contains('div', 'Firstname')
      .find('input')
      .first()
      .type('Cypress');
    cy.contains('div', 'Lastname')
      .find('input')
      .first()
      .type('User');
    cy.contains('div', 'Password')
      .find('input')
      .first()
      .type(password);
    cy.contains('div', 'Repeat password')
      .find('input')
      .first()
      .type(password);

    // Sign up
    cy.contains('button', 'Sign up')
      .first()
      .click();

    cy.wait('@new-user').should('have.property', 'status', 201);
  });

  it('Performs sign up of already existing user', () => {
    // Spy on requests
    cy.server();
    cy.route({
      method: 'POST',
      url: '/users'
    }).as('users-post');

    cy.visit('localhost:8080/');

    // Open sign up form
    cy.contains('button', 'Sign up')
      .first()
      .click();

    // Fill in form data
    cy.contains('div', 'Username')
      .find('input')
      .first()
      .type(username);
    cy.contains('div', 'Firstname')
      .find('input')
      .first()
      .type('Cypress');
    cy.contains('div', 'Lastname')
      .find('input')
      .first()
      .type('User');
    cy.contains('div', 'Password')
      .find('input')
      .first()
      .type(password);
    cy.contains('div', 'Repeat password')
      .find('input')
      .first()
      .type(password);

    // Sign up
    cy.contains('button', 'Sign up')
      .first()
      .click();

    cy.wait('@users-post').should('have.property', 'status', 409);
  });

  it('Performs sign in', () => {
    // Spy on POST requests to /users endpoint
    cy.server();
    cy.route({
      method: 'POST',
      url: '/sessions'
    }).as('sessions-post');

    cy.visit('localhost:8080/');

    // Fill in form data
    cy.contains('div', 'Username')
      .find('input')
      .first()
      .type(username);
    cy.contains('div', 'Password')
      .find('input')
      .first()
      .type(password);

    // Sign in
    cy.contains('button', 'Sign in')
      .first()
      .click();

    cy.wait('@sessions-post').should('have.property', 'status', 201);
    cy.url().should('include', '/app');
  });

  it('Creates playlist', () => {
    // Spy on POST requests to /users endpoint
    cy.server();
    cy.route({
      method: 'POST',
      url: '/playlists'
    }).as('playlists-post');

    // Open nav if it's closed

    cy.contains('div', 'New playlist')
      .last()
      .click();

    // Fill in playlists form
    // Submit form
    // Check that playlist exists in navbar drawer
  });

  it('Creates playlist item', () => {});

  it('Plays created item', () => {
    cy.wait(3000);
  });

  it('Stops playback', () => {});

  it('Deletes playlist item', () => {});

  it('Deletes playlist', () => {});

  it('Signs out', () => {});
});
