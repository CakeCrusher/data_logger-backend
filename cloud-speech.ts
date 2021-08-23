const {SpeechClient} = require('@google-cloud/speech')
const client = new SpeechClient({keyFilename: './voice-logger-key.json'})


const transcribeRecording = async (gcsURI: string): Promise<any> => {
  const audio = {
    uri: gcsURI
  }
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US'
  }
  const request = {
    audio: audio,
    config: config
  }
  const [response] = await client.recognize(request)
  const transcription: any = response.results
  const transcriptionStr = transcription.map((result: any) => result.alternatives[0].transcript).join('\n');

  return transcription
}

module.exports = {transcribeRecording}