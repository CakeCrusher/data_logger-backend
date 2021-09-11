import { Transcription } from "./types";

const levenshtein = require('js-levenshtein');
const { testParser, runningParser } = require('./tableParsers')



const transcriptionHandler = (transcription: string) => {
  const tables = ['testing', 'running']
  const transcribedTable = transcription.split(' ')[0]
  const closestTable = tables.reduce((acc, table) => {
    const distance = levenshtein(transcribedTable, table)
    return distance < acc.distance ? {distance, table} : acc
  }, {distance: 3, table: 'ERROR'}).table
  console.log(closestTable);
  
  let payload: any = {}
  switch (closestTable) {
    case 'testing':
      payload = testParser(transcription)
      break
    case 'running':
      payload = runningParser(transcription)
      break
    default:
      null
      break
  }
  
  const hasNull = Object.keys(payload).find((key) => !payload[key])
  if (hasNull) {
    return {
      table: 'ERROR',
      dateTime: new Date().toISOString(),
      payload
    }
  }

  return {
    table: closestTable,
    dateTime: new Date().toISOString(),
    payload
  } as Transcription
}

module.exports = {transcriptionHandler}