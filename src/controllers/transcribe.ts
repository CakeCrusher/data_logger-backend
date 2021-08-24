import { Request, Response } from 'express'
import { createM4AFile, deleteFileLocally } from '../helperFunctions';
const { uploadFile, deleteFile } = require('../api/cloud-storage')
const { transcribeRecording } = require('../api/cloud-speech')
const { transcriptionHandler } = require('../transcriptionClassifier')
const linear16 = require('linear16')
const fs = require('fs')


const getTranscription = async (req: Request, res: Response) => {

  let m4aStringified: string = req.body.audioBase64
  // // To save a specific audio string
  // await fs.writeFileSync('./audioBase64-example.txt', m4aStringified, {encoding: 'base64'}, (err: any) => {null})
  // // To load a specific audio string
  // if (req.body.test) {
  //   console.log('Test');
  //   m4aStringified = await fs.readFileSync('./audioBase64-example.txt', {encoding: 'base64'})
  // }

  await createM4AFile(m4aStringified)

  console.log('Transcribing...');

  const transcribe = async (fileName: string): Promise<any> => {
    const convertedFilePath = await linear16(`./${fileName}`, `./${fileName.split('.')[0]}.raw`)
    const convertedFileName = convertedFilePath.split('/').slice(-1)[0]
    
    const gcsURI = await uploadFile(convertedFileName)
    const transcription = await transcribeRecording(gcsURI)
    await deleteFile(convertedFileName)
    console.log(convertedFileName);
    
    deleteFileLocally(convertedFileName)
    deleteFileLocally('toTranscribe.m4a')
     
    return transcription
  }

  const transcription = await transcribe('toTranscribe.m4a')

  console.log('transcription: ', JSON.stringify(transcription));
  const stringifiedTranscription = transcription.map((portion: any) => portion.alternatives[0].transcript).join(' $ ')

  console.log('stringifiedTranscription: ', stringifiedTranscription);
  const result = transcriptionHandler(stringifiedTranscription)
  console.log('result: ', result);


  res.json(result) 
}

export { getTranscription }