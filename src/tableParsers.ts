import { keyWordInfo } from "./helperFunctions";
import { RunningFields } from "./types";

const levenshtein = require('js-levenshtein');

const testParser = (transcription: string) => {
  const splitTable = transcription.split(' ')
  const parsedTranscription = splitTable.slice(1).filter((item) => {
    return item !== '$'
  })
  const payload = {speech: parsedTranscription.join(' ')}
  return payload
}

const runningParser = (transcription: string): RunningFields => {
  const splitTable = transcription.split(' ')
  // get all items from splitTable but the first and exclude any items that equal '$'
  const parsedTranscription = splitTable.slice(1).filter((item) => {
    return item !== '$'
  })
  const minuteInfo = keyWordInfo(parsedTranscription, ['minute'], 'int')
  const secondInfo = keyWordInfo(parsedTranscription, ['second'], 'int')
  let mileInfo = keyWordInfo(parsedTranscription, ['mile', 'MI'], 'float')
  
  let timeTarget
  let distanceTarget
  if (typeof minuteInfo.target === 'number' && typeof secondInfo.target === 'number') {
    timeTarget = minuteInfo.target * 60 + secondInfo.target
  }
  if (typeof mileInfo.target === 'number') {
    distanceTarget = mileInfo.target * 1609.34
  }


  const payload = {
    time: timeTarget,
    distance: distanceTarget,
  }

  return payload  
}

module.exports = {
  testParser,
  runningParser,
}