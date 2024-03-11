import express from 'express'

const app = express()
const PORT = 3000

app.use('/locations', express.static('public'))
app.use(logger)


app.get('/', (request, response) => {
  response.send('Welcome to the Berlin things website')
})

app.get('/contact', (request, response) => {
  response.send('Reach out to us if you have any questions.')
})

app.get('/Berlinthings/:travel', (request, response) => {
  const BerlinTravel = request.params.travel

  response.send(`You chose the Berlinthing with the ID of ${BerlinTravel}`)
})

app.post('/contact', (request, response) => {
  response.send('Thank you for your message. We will be in touch soon.')
})

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})

import { logger } from './middlewares/logger.js'

