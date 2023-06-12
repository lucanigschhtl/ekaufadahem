const { defineConfig } = require('cypress')
const makeEmailAccount = require('./tests/e2e/plugins/email-account')
const MongoClient = require('mongodb').MongoClient

module.exports = defineConfig({
  ETHEREAL_CACHE: false,
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'tests/e2e/results/TEST-RESULT-[hash].xml',
    toConsole: true,
  },
  browser: 'chrome',
  taskTimeout: 60000,
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  e2e: {
    setupNodeEvents(on, config) {
      makeEmailAccount().then((emailAccount) => {
        on('task', {
          getUserEmail() {
            return emailAccount.email
          },
          getLastEmail() {
            return emailAccount.getLastEmail()
          },
        })
      })

      on('task', {
        resetDatabase: async () => {
           
          const MongoClient = require('mongodb').MongoClient
          const uri = 'mongodb+srv://luca:sac0UxwUDHNvRH8z@cluster0.7qabgyw.mongodb.net/testingdb'
          const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        
          try {
            await client.connect()
    
            // Get a reference to the database
            const db = client.db('testingdb')
    
            // Get a list of all collections in the database
            const collections = await db.listCollections().toArray()
    
            // Drop each collection
            for (const collection of collections) {
              await db.collection(collection.name).drop()
            }
    
            const collection = db.collection('users')
        
            // Insert an admin user into the collection
            const adminUser = {
              nr: 1,
              email: 'admin@example.com',
              password: 'password',
              firstName: 'Admin',
              lastName: 'User',
              activated: true,
              type: 'ADMIN',
              salt:'02f253e5a3d085b14890621db8e9274a',
              password:'a0aed41288f3461381aee77bce3922a99f7376a70cd7650b2150e05ee97f08e4'
            }
            await collection.insertOne(adminUser)
          } catch (err) {
            throw err
          } finally {
            // Close the database connection
            await client.close()
            return null
           
          }
        },
      })

      // ...
    },
    baseUrl: 'http://localhost:8080/',
    specPattern: 'tests/e2e/specs/**/*test.js',
    supportFile: 'tests/e2e/support/index.js',
  },
})
