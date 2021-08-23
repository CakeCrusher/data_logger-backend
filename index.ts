const express = require('express')
const fs = require('fs')
const linear16 = require('linear16')
const {uploadFile, deleteFile} = require('./cloud-storage')
const {transcribeRecording} = require('./cloud-speech')
const {transcriptionHandler} = require('./transcription-handler')

import {Request, Response} from 'express'

const app = express()
app.use(express.json({limit: '50mb'}));
const PORT = process.env.PORT || 3000

const createM4AFile = async (m4aStringified: string): Promise<String> => {
  await fs.writeFileSync('./assets/toTranscribe.m4a', m4aStringified, {encoding: 'base64'}, (err: any) => {console.error(err)})
  console.log('File downloaded');
  return './assets/toTranscribe.m4a'
}
const deleteFileLocally = (fileName: string) => {
  fs.unlink(`./assets/${fileName}`, (err: any) => {
    if (err) {
      console.error('ERROR: ', err)
      return
    }
  })
}

const transcribe = async (fileName: string): Promise<any> => {
  const convertedFilePath = await linear16(`./assets/${fileName}`, `./assets/${fileName.split('.')[0]}.raw`)
  const convertedFileName = convertedFilePath.split('/').slice(-1)[0]
  
  const gcsURI = await uploadFile(convertedFileName)
  const transcription = await transcribeRecording(gcsURI)
  await deleteFile(convertedFileName)
  console.log(convertedFileName);
  
  deleteFileLocally(convertedFileName)
  deleteFileLocally('toTranscribe.m4a')
   
  return transcription
}


app.post('/', async (req: Request, res: Response) => {
  let m4aStringified: string = req.body.audioBase64
  // // To save a specific audio string
  // await fs.writeFileSync('./assets/audioBase64-example.txt', m4aStringified, {encoding: 'base64'}, (err: any) => {null})
  if (req.body.test) {
    console.log('Test');
    
    // To load a specific audio string
    m4aStringified = await fs.readFileSync('./assets/audioBase64-example.txt', {encoding: 'base64'})
  }

  await createM4AFile(m4aStringified)

  console.log('Transcribing...');
  const transcription = await transcribe('toTranscribe.m4a')
  console.log('transcription: ', JSON.stringify(transcription));
  const stringifiedTranscription = transcription.map((portion: any) => portion.alternatives[0].transcript).join(' $ ')

  console.log('stringifiedTranscription: ', stringifiedTranscription);
  const result = transcriptionHandler(stringifiedTranscription)
  console.log('result: ', result);


  res.json(result) 
})


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

