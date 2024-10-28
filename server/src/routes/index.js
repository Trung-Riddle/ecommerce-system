const auth = require('./authRoutes')
const user = require('./userRoutes')
const shop = require('./shopRoutes')
const category = require('./categoryRoutes')
// const payment = require('./paymentRoutes')
const { notFound, internalServerError } = require('../middleware/handleError')

const BASE_ENDPOINT = '/api/v1/'
const initWebRoutes = (app) => {
  // app.use(`${BASE_ENDPOINT}`, payment)
  app.use(`${BASE_ENDPOINT}auth`, auth)
  app.use(`${BASE_ENDPOINT}user`, user)
  app.use(`${BASE_ENDPOINT}shop`, shop)
  app.use(`${BASE_ENDPOINT}category`, category)

  app.use(notFound)
  app.use(internalServerError)
}

module.exports = initWebRoutes