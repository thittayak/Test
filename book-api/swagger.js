const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book API',
      version: '1.0.0',
      description: 'Mini Project Nuxt + Express CRUD API'
    },
    servers: [
      { url: 'http://localhost:3001' }
    ]
  },
  apis: ['./*.js'] // ไฟล์ที่เขียน route
}

const specs = swaggerJsdoc(options)

module.exports = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
}
