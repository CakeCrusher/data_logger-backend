const {Storage} = require('@google-cloud/storage')
const storage = new Storage({keyFilename: './data-logger-322616-a7ba1d41c824.json'})
const bucket = storage.bucket('speeches_for_transcription')

const uploadFile = async (fileName) => {
  const recordingURL = await bucket.upload(fileName, { destination: fileName })

  return `gs://speeches_for_transcription/${fileName}`
}
const deleteFile = async (fileName) => {
  const fileToDelete = await bucket.file(fileName)
  await fileToDelete.delete()
}

module.exports = {uploadFile, deleteFile}