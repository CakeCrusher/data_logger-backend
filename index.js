const express = require('express')
const fs = require('fs')
const linear16 = require('linear16')
const {uploadFile, deleteFile} = require('./cloud-storage')
const {transcribeRecording} = require('./cloud-speech')
const {transcriptionHandler} = require('./transcription-handler')

const app = express()
app.use(express.json({limit: '50mb'}));
const PORT = process.env.PORT || 3000

const createM4AFile = async (m4aStringified) => {
  await fs.writeFileSync('toTranscribe.m4a', m4aStringified, {encoding: 'base64'}, (err) => {null})
  console.log('File downloaded');
}
const deleteFileLocally = (fileName) => {
  fs.unlink(`./${fileName}`, (err) => {
    if (err) {
      console.error('Error unlinking')
      return
    }
  })
}

const transcribe = async (fileName) => {
  const convertedFileName = await linear16(fileName, fileName.split('.')[0] + '.raw')
  const gcsURI = await uploadFile(convertedFileName)
  const transcription = await transcribeRecording(gcsURI)
  await deleteFile(convertedFileName)
  deleteFileLocally(convertedFileName)
   
  return transcription
}


app.post('/', async (req, res) => {
  const m4aStringified = req.body.audioBase64
  await createM4AFile(m4aStringified)

  const transcription = await transcribe('toTranscribe.m4a')
  console.log('transcription: ', JSON.stringify(transcription));
  const stringifiedTranscription = transcription.map(portion => portion.alternatives[0].transcript).join(' $ ')

  console.log('stringifiedTranscription: ', stringifiedTranscription);
  const result = transcriptionHandler(stringifiedTranscription)
  console.log('result: ', result);

  deleteFileLocally('toTranscribe.m4a')

  res.json(result)
})


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

