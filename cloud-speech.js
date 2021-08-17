const {SpeechClient} = require('@google-cloud/speech')
const client = new SpeechClient({keyFilename: './data-logger-key.json'})


const transcribeRecording = async (gcsURI) => {
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
  const transcription = response.results
  const transcriptionStr = transcription.map(result => result.alternatives[0].transcript).join('\n');

  return transcription
}

module.exports = {transcribeRecording}