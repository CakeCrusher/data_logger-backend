import { Request, Response } from 'express'
import { createM4AFile, deleteFileLocally } from '../helperFunctions';
const { uploadFile, deleteFile } = require('../api/cloud-storage')
const { transcribeRecording } = require('../api/cloud-speech')
const { transcriptionHandler } = require('../transcriptionClassifier')
const linear16 = require('linear16')
const fs = require('fs')


const getTranscription = async (req: Request, res: Response) => {
  console.log('transcribing');
  
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
    console.log(`translating file: ${fileName}`);
    const convertedFilePath = await linear16(`./${fileName}`, `./${fileName.split('.')[0]}.raw`)
    const convertedFileName = convertedFilePath.split('/').slice(-1)[0]
    
    console.log(`uploading file: ${convertedFileName}`);
    const gcsURI = await uploadFile(convertedFileName)
    console.log(`transcribing from gcs: ${gcsURI}`);
    const transcription = await transcribeRecording(gcsURI)
    console.log(`deleting from from gcs: ${convertedFileName}`);
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