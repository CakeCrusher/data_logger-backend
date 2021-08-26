const express = require('express')
const fs = require('fs')
const linear16 = require('linear16')
const {uploadFile, deleteFile} = require('./api/cloud-storage')
const {transcribeRecording} = require('./api/cloud-speech')
const {transcriptionHandler} = require('./transcriptionClassifier')
import transcribeRoutes from './routes/transcribe'

import {Request, Response} from 'express'

const app = express()
app.use(express.json({limit: '50mb'}));
const PORT = process.env.PORT || 3000

app.use(transcribeRoutes)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

