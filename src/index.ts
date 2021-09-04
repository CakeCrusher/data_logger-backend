require('dotenv').config()
const express = require('express')
import transcribeRoutes from './routes/transcribe'
import actionsRoutes from './routes/actions'

const app = express()
app.use(express.json({limit: '50mb'}));
const PORT = process.env.PORT || 3000

app.use(transcribeRoutes)
app.use(actionsRoutes)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

