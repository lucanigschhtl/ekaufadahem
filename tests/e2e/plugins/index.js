// const makeEmailAccount = require('./email-account')
// // In your cypress/plugins/index.js file
// const MongoClient = require('mongodb').MongoClient

// /* eslint-disable arrow-body-style */
// // https://docs.cypress.io/guides/guides/plugins-guide.html

// // if you need a custom webpack configuration you can uncomment the following import
// // and then use the `file:preprocessor` event
// // as explained in the cypress docs
// // https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// // /* eslint-disable import/no-extraneous-dependencies, global-require */
// // const webpack = require('@cypress/webpack-preprocessor')

// module.exports = (on, config) => {
//   makeEmailAccount().then((emailAccount) => {
//     on('task', {
//       getUserEmail() {
//         return emailAccount.email
//       },
//       getLastEmail() {
//         return emailAccount.getLastEmail()
//       },
//     })
//   })

//   on('task', {
//     async resetDatabase() {
//      
//      }
//    })

//  }

 const makeEmailAccount = require('./email-account')
const MongoClient = require('mongodb').MongoClient

module.exports = (on, config) => {
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
      // ...
    },
  })

  // ...
}