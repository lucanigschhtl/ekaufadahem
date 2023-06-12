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