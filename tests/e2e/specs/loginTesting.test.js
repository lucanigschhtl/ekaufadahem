describe('Login', () => {

     beforeEach(() =>  {
      cy.task('resetDatabase')
    })
    
    it('should display an error message for invalid login credentials', () => {
      // Visit the login page
      cy.visit('/login')
      cy.wait(3000)
  
      // Enter an invalid email and password
      cy.get('[data-cy=emailinput]').type('invalid@example.com')
      cy.get('[data-cy=passwordinput]').type('password')
  
      // Click the submit button
      cy.get('[data-cy=submit]').click()
  
      // Verify that an error message is displayed
      // This will depend on how your application displays error messages
      // For example, you might check for the presence of an element with a specific class or data attribute
      cy.get('[data-cy=alertbox]').should('contain', 'Dieses Konto existiert nicht')
      
    })

    it('should display an error message for an incorrect password', () => {
        // Visit the login page
        cy.visit('/login')
        cy.wait(3000)
        // Enter a valid email and an incorrect password
        
        cy.get('[data-cy=emailinput]').type('admin@example.com')
        cy.get('[data-cy=passwordinput]').type('incorrectpassword')
    
        // Click the submit button
        cy.get('[data-cy=submit]').click()
    
        // Verify that an error message is displayed
        // This will depend on how your application displays error messages
        // For example, you might check for the presence of an element with a specific class or data attribute
        cy.get('[data-cy=alertbox]').should('contain', 'Falsches Passwort')
      })

       it('should login', () => {
        // Visit the login page
        cy.visit('/login')
        cy.wait(3000)
    
        // Enter a valid email and an incorrect password
        cy.get('[data-cy=emailinput]').type('admin@example.com')
        cy.get('[data-cy=passwordinput]').type('qYv2vqGjPf')
    
        // Click the submit button
        cy.get('[data-cy=submit]').click()
    
        // Verify that an error message is displayed
        // This will depend on how your application displays error messages
        // For example, you might check for the presence of an element with a specific class or data attribute
        cy.url().should('include','/customer/orders')
      })

     
        it('should set access and refresh tokens', () => {
        // Visit the login page
        cy.visit('/login')
       
        // Enter valid login credentials
        cy.get('[data-cy=emailinput]').type('admin@example.com')
        cy.get('[data-cy=passwordinput]').type('qYv2vqGjPf')
       
        // Click the submit button
        cy.get('[data-cy=submit]').click()
       
        // Verify that the access and refresh tokens are set in the Vuex store
        cy.window().its('app.$store.getters.getAccessToken').should('not.be.undefined')
        cy.window().its('app.$store.getters.getRefreshToken').should('not.be.undefined')
        })

          it('should redirect to login page if no access or refresh token is set', () => {

          cy.visit('/login')
      
          // Enter valid login credentials
          cy.get('[data-cy=emailinput]').type('admin@example.com')
          cy.get('[data-cy=passwordinput]').type('qYv2vqGjPf')
          
          // Click the submit button
          cy.get('[data-cy=submit]').click()
          
          cy.url().should('include', '/customer/orders')

          // Clear the Vuex store to remove any existing tokens
          cy.window().its('app.$store').invoke('commit', 'setAccessToken', undefined)
          cy.window().its('app.$store').invoke('commit','setRefreshToken', undefined)
         
          // reload
          cy.reload()
         
          // Verify that the user is redirected to the login page
          cy.url().should('include', '/login')
          })
         

         it('should log out the user and redirect to login page', () => {
          // Visit the login page
          cy.visit('/login')
        
          // Enter valid login credentials
          cy.get('[data-cy=emailinput]').type('admin@example.com')
          cy.get('[data-cy=passwordinput]').type('qYv2vqGjPf')
          
          // Click the submit button
          cy.get('[data-cy=submit]').click()
        
         cy.wait(3000)
         // Click the logout button
         cy.get('[data-cy=logout]').click()
        
         // Verify that the user is redirected to the login page
         cy.url().should('include', '/login')
        
         // Verify that the access and refresh tokens are removed from the Vuex store
         cy.window().its('app.$store.getters.getAccessToken').should('be.undefined')
         cy.window().its('app.$store.getters.getRefreshToken').should('be.undefined')
         })

         it('should automatically renew the access token using the refresh token', () => {
          // Visit the login page
          cy.visit('/login')
         
          // Enter valid login credentials
          cy.get('[data-cy=emailinput]').type('admin@example.com')
          cy.get('[data-cy=passwordinput]').type('qYv2vqGjPf')
         
          // Click the submit button
          cy.get('[data-cy=submit]').click()
          
          cy.url().should('include','/customer/orders')
         
          // Set the access token to an expired value
          cy.window().its('app.$store').invoke('commit', 'setAccessToken', 'expired')
         
          // Visit a protected page
          cy.visit('/customer/orders')
         
          // Verify that a new access token is set in the Vuex store
          cy.window().its('app.$store.getters.getAccessToken').should('be.undefined')
          })
        

        it('should redirect to login page if refresh token is expired', () => {
       
          // Visit the login page
          cy.visit('/login')
         
          // Enter valid login credentials
          cy.get('[data-cy=emailinput]').type('admin@example.com')
          cy.get('[data-cy=passwordinput]').type('qYv2vqGjPf')
         
          // Click the submit button
          cy.get('[data-cy=submit]').click()
          
         
        
          // Set the refresh token to an expired value
          cy.window().its('app.$store').invoke('commit', 'setRefreshToken', 'expired')
         
          // Visit a protected page
          cy.reload()
         
          // Verify that the user is redirected to the login page
          cy.url().should('include', '/login')
          })
       
  })
  

   