const googleStorage = require('@google-cloud/storage')
const storage = new googleStorage.Storage({keyFilename: './voice-logger-key.json'})
const bucket = storage.bucket('speeches_to_transcribe')
// speeches_for_transcription
const uploadFile = async (fileName: string): Promise<string> => {
  const recordingURL = await bucket.upload(`./${fileName}`, { destination: fileName })
  return `gs://speeches_to_transcribe/${fileName}`
}
const deleteFile = async (fileName: string) => {
  const fileToDelete = await bucket.file(fileName)
  await fileToDelete.delete()
}

module.exports = {uploadFile, deleteFile}