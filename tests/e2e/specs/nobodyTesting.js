// https://docs.cypress.io/api/table-of-contents


describe('Test Login', () => {
  
 

  it('Input Fields are there', () => {
    cy.visit('http://localhost:8080')
    cy.get('input:first').should('have.attr', 'placeholder', 'Email-Adresse')
    cy.get('input:last').should('have.attr', 'placeholder', 'Passwort')
  })
 
  it('Navigationt to Password Reset is here', () => {
    cy.visit('http://localhost:8080')
    cy.contains('a', 'Passwort Zurücksetzen')
    cy.contains('a', 'Neues Konto Erstellen')
  })

  it('login error works Works',()=>{
    cy.visit('http://localhost:8080')
    cy.get('[data-cy="emailinput"]').type("fjdlasfka@fndlsflas.com")
    cy.get('[data-cy="passwordinput"]').type("fdsjafjfdsa")
    cy.get('[data-cy="submit"]').click()
    cy.get('[data-cy="alertbox"]').contains("Dieses Konto existiert nicht")
  })

  it('check if register link works',()=>{
    cy.visit('http://localhost:8080')
    cy.get('[data-cy="RegisterBtn"]').click()
    cy.location('hash').should('eq','#/register')
  })
  it('check if password reset link works',()=>{
    cy.visit('http://localhost:8080')
    cy.get('[data-cy="PasswordResetBtn"]').click()
    cy.location('hash').should('eq','#/password/reset')
  })

  it('check if redirection works from manager',()=>{
    cy.visit('http://localhost:8080/manager')
    cy.location('hash').should('eq','#/login')
  })

  it('check if redirection works from customer',()=>{
    cy.visit('http://localhost:8080/customer')
    cy.location('hash').should('eq','#/login')
  })

  it('check if redirection works from picker',()=>{
    cy.visit('http://localhost:8080/picker')
    cy.location('hash').should('eq','#/login')
  })

  it('check if redirection works from picker',()=>{
    cy.visit('http://localhost:8080/picker')
    cy.location('hash').should('eq','#/login')
  })
})

describe('Test Create Account', () => {
  let userEmail

  before(() => {
    // get and check the test email only once before the tests
    cy.task('getUserEmail').then((email) => {
      expect(email).to.be.a('string')
      userEmail = email
    })
  })

  it('Input Fields are there', () => {
    cy.visit('http://localhost:8080/#/register')
    cy.contains('Hier können sich zum Einkaufsportal "Ekaufa Dahem" registrieren')
  })

  it('Navigationt to Password Reset is here', () => {
    cy.visit('http://localhost:8080/login')
    cy.contains('a', 'Passwort Zurücksetzen')
    cy.contains('a', 'Neues Konto Erstellen')
  })
 
    const itemsNotWork = [
      {
        inputs: 
          [
            {
              element:'feedback-firstName',
              value: 'Luca'
            },
            {
              element:'feedback-lastName',
              value:'Nigsch'
            },
            {
              element:'feedback-email',
              value:'nigsch.lugmail.com'
            },
            {
              element:'feedback-tel',
              value:'1213543'
            },
            {
              element:'feedback-street',
              value:'Garsella 41'
            },
            {
              element:'feedback-plz',
              value:'6731'
            },
            {
              element:'feedback-password',
              value:'jfdlsaf'
            },
            {
              element:'feedback-passwordRepeat',
              value:'fdas'
            },
          ],
          error:"Bitte füllen Sie alle Felder aus"
      },
      {
          inputs: [
            {
            element:'feedback-firstName',
            value: 'Luca'
            },
            {
              element:'feedback-lastName',
              value:'Nigsch'
            }
        ],
        error:"Bitte füllen Sie alle Felder aus"
      }
    ]

    itemsNotWork.forEach(test => {
    
       it('test if inputs matter',()=>{
        cy.visit('http://localhost:8080/#/register')
        test.inputs.forEach(inputField => {
          cy.get(`[id="${inputField.element}"]`).type(inputField.value)
        });
        cy.get('[data-cy="submit"]').click()
        cy.contains('[data-cy="alertbox"]',test.error)
       })
    });

    it('test if registration works',()=>{
      cy.visit('http://localhost:8080/#/register')
      cy.get('#feedback-firstName').type("Marco")
      cy.get('#feedback-lastName').type("Konzett")
      cy.get('#feedback-email').type(userEmail)
      cy.get('#feedback-tel').type("+43780"+(Math.floor(Math.random() * 1000) + 1).toString()+(Math.floor(Math.random() * 1000) + 1).toString())
      cy.get('#feedback-plz').type("5435")
      cy.get('#feedback-street').type("Brunnenfeldstraße 42")
      cy.get('#feedback-place').type("Raggal")
      cy.get('#feedback-password').type("katholischeKirche202")
      cy.get('#feedback-passwordRepeat').type("katholischeKirche202")
      cy.get('[data-cy="submit"]').click()
      cy.contains('p','Du solltest in den folgenden Minuten eine Email mit einem Bestätigungslink')
      cy.wait(10000)
      cy.task('getLastEmail')
      .its('html')
      .then((html) => {
        cy.document({ log: false }).invoke({ log: false }, 'write', html)
        cy.expect(html).to.contain('Herzlich Willkommen beim Online-Bestellservice ekaufa dahem.')
        cy.get('a').click()
        cy.contains('p','Dein Konto wurde aktiviert!')
      })
    })

    it('test if login works',()=>{
      cy.visit('http://localhost:8080/#/login')
      cy.get('[data-cy="emailinput"]').type(userEmail)
      cy.get('[data-cy="passwordinput"]').type("katholischeKirche202")
      cy.get('[data-cy="submit"]').click()
      cy.location('pathname').should('eq','/')
    })
    it('test if password reset without input does not work',()=>{
      cy.visit('http://localhost:8080/#/password/reset')
      cy.get('[data-cy="submit"]').click()
      cy.contains('[data-cy="alertbox"]','Bitte geben Sie Ihre Email-Adressse an!')
    })

    it('test if password reset with false email does not work',()=>{
      cy.visit('http://localhost:8080/#/password/reset')
      cy.get('[data-cy="emailinput"]').type("dieseemailsollteesnichtgeben@gmail.com")
      cy.get('[data-cy="submit"]').click()
      cy.contains('[data-cy="alertbox"]','Ein Konto mit dieser Email-Adresse ist nicht vorhanden.')
    })


    it('test if password reset works',()=>{
      cy.visit('http://localhost:8080/#/password/reset')
      cy.get('[data-cy="emailinput"]').type(userEmail)
      cy.get('[data-cy="submit"]').click()
      cy.contains('p','Du solltest in den folgenden Minuten eine Email mit einem Link erhalten.')
      cy.wait(10000)
      cy.task('getLastEmail')
      .its('html')
      .then((html) => {
        cy.document({ log: false }).invoke({ log: false }, 'write', html)
        cy.expect(html).to.contain('Mit dem unteren Link können Sie ihr Passwort zurücksetzen.')
        cy.get('a').click()
        cy.get('#feedback-password').should('be.visible').type("evangelischeKirche202") 
        cy.get('#feedback-passwordRepeat').should('be.visible').type("evangelischeKirche202") 
        cy.get('[data-cy="submit"').click()
        cy.contains('p','Dein Passwort wurde erfolgreich geändert')
        cy.visit('http://localhost:8080')
        cy.get('[data-cy="emailinput"]').type(userEmail)
        cy.get('[data-cy="passwordinput"]').type("evangelischeKirche202")
        cy.get('[data-cy="submit"]').click()
        cy.location("pathname").should('eq','/')
       })
    })
})
