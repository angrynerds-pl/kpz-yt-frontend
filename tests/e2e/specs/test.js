// https://docs.cypress.io/api/introduction/api.html

describe('Test', () => {
  let username;
  const password = 'topsecret';
  const playlistName = 'Favorites';
  before(() => {
    const now = new Date();
    const millisSinceEpoch = now.getTime();
    username = `cy${millisSinceEpoch}`;
  });

  const playlistItemLink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const playlistItemTitle = 'Rick Astley - Never Gonna Give You Up (Video)';

  beforeEach(() => {
    cy.viewport('macbook-15');
  });

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

    cy.url().should('include', '/signup');

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

    cy.url().should('include', '/signup');

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
    // Spy on requests
    cy.server();
    cy.route({
      method: 'POST',
      url: '/playlists'
    }).as('playlists-post');

    cy.url().should('include', '/app');

    cy.get('.v-navigation-drawer__content')
      .get('.mdi-plus')
      .first()
      .click();

    cy.url().should('include', '/app/playlists');

    cy.get('.v-content__wrap')
      .contains('div', 'Playlist name')
      .find('input')
      .first()
      .type('Favorites{enter}');

    cy.wait('@playlists-post')
      .should('have.property', 'status', 201)
      .then(() => {
        cy.wait(500);
        cy.get('.v-navigation-drawer__content').within(() => {
          cy.get('.v-list-item__title').contains(playlistName);
        });
      });
  });

  it('Creates playlist item', () => {
    // Spy on requests
    cy.server();
    cy.route({
      method: 'POST',
      url: '/playlists/**'
    }).as('playlists-post');
    cy.route({
      method: 'GET',
      url: '/youtubeapi/**'
    }).as('youtubeapi-get');

    cy.url().should('include', '/app/playlists/');

    cy.get('.v-content__wrap')
      .contains('Add item')
      .first()
      .click();

    cy.get('.v-dialog')
      .contains('div', 'Link')
      .find('input')
      .first()
      .type(playlistItemLink);

    cy.get('.v-dialog').within(() => {
      cy.contains('button', 'Add').click();
    });

    cy.wait('@playlists-post')
      .should('have.property', 'status', 201)
      .then(() => {
        cy.wait('@youtubeapi-get')
          .should('have.property', 'status', 200)
          .then(() => {
            cy.wait(500);
            cy.get('.v-content__wrap')
              .find('.v-list-item__title')
              .contains(playlistItemTitle);
          });
      });
  });

  it('Plays created item', () => {
    // Click on playlist item to start playback
    cy.get('.v-content__wrap').within(() => {
      cy.get('.v-list-item__title')
        .contains(playlistItemTitle)
        .click();
    });

    // Wait some time for YT playback start
    cy.wait(3000);

    cy.get('iframe');
    cy.get('.v-footer').should('contain', playlistItemTitle);
  });

  it('Stops playback', () => {
    // Pause and check player state again
    cy.get('.mdi-pause')
      .first()
      .click();
    cy.get('.mdi-play');
  });

  it('Deletes playlist item', () => {
    // Spy on requests
    cy.server();
    cy.route({
      method: 'DELETE',
      url: '/playlist-items/**'
    }).as('playlist-items-delete');

    cy.get('.v-content__wrap').within(() => {
      cy.get('.mdi-delete')
        .click()
        .wait('@playlist-items-delete')
        .should('have.property', 'status', 200)
        .then(() => {
          cy.wait(500);
          cy.get('.v-content__wrap').should('not.contain', playlistItemTitle);
        });
    });
  });

  it('Deletes playlist', () => {
    // Spy on requests
    cy.server();
    cy.route({
      method: 'DELETE',
      url: '/playlists/**'
    }).as('playlists-delete');

    cy.get('.v-toolbar__content')
      .get('.mdi-delete')
      .first()
      .click()
      .then(() => {
        cy.get('.v-dialog')
          .contains('button', 'Delete')
          .click()
          .wait('@playlists-delete')
          .should('have.property', 'status', 200)
          .then(() => {
            cy.wait(500);
            cy.get('.v-navigation-drawer__content').within(() => {
              cy.get('.v-list-item__title').should('not.contain', playlistName);
            });
            cy.url().should('include', '/app');
          });
      });
  });

  it('Signs out', () => {
    cy.get('.v-navigation-drawer__content')
      .get('.mdi-exit-to-app')
      .click()
      .then(() => {
        cy.url().then(url => {
          expect(url.substr(-5)).to.equal('8080/');
        });
      });
  });
});
