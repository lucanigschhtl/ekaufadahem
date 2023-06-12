
describe('Orders', () => {

    beforeEach(() => {
        // Visit the login page
        cy.visit('/login')
       
        // Enter valid login credentials
        cy.get('[data-cy=emailinput]').type('admin@example.com')
        cy.get('[data-cy=passwordinput]').type('qYv2vqGjPf')
       
        // Click the submit button
        cy.get('[data-cy=submit]').click()
        })
    it('should not display any orders', () => {
    // Visit the orders page
    cy.visit('/customers/orders')
    cy.wait(3000)
    // Verify that the orders table is not displayed
    cy.get('[data-cy=orders-table]').should('not.exist')
   
    // Verify that the "no orders" message is displayed
    cy.contains('Im Moment sind keine aktiven Bestellungen vorhanden').should('be.visible')
    })


    it.only('there should be no time available', () => {
        // Visit the orders page
        cy.visit('/customers/ordering')
        cy.wait(3000)
        // Verify that the orders table is not displayed
        cy.get('[data-cy=timestatusmessage]').should('include')
       
        // Verify that the "no orders" message is displayed
        cy.contains('Im Moment sind keine aktiven Bestellungen vorhanden').should('be.visible')
        })
   })
   