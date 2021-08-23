import { KeyWordInfo, RunningFields } from "./types";

const levenshtein = require('js-levenshtein');

const testParser = (transcription: string) => {
  const splitTable = transcription.split(' ')
  const parsedTranscription = splitTable.slice(1).filter((item) => {
    return item !== '$'
  })
  const payload = {speech: parsedTranscription.join(' ')}
  return payload
}

const numberEdgeCases = (numberString: string): string => {
  switch (numberString) {
    case 'one':
      return '1'
    case 'two':
    case 'to':
    case 'too':
      return '2'
    case 'three':
    case 'tree':
      return '3'
    case 'four':
    case 'for':
      return '4'
    case 'five':
    case 'hive':
      return '5'
    case 'six':
    case 'sex':
      return '6'
    case 'seven':
      return '7'
    case 'eight':
    case 'ate':
      return '8'
    case 'nine':
      return '9'
    default:
      return numberString
  }
}
// numberEdgeCases('to')

const keyWordInfo = (parsedTranscription: string[], keyWords: string[], targetType: string = 'string'): KeyWordInfo => {
  const keyWordSymbol = parsedTranscription.find(word => keyWords.find(keyWord => levenshtein(word, keyWord) < 2))
  let keyWordIndex
  if (keyWordSymbol) {
    keyWordIndex = parsedTranscription.indexOf(keyWordSymbol)
  } else {
    keyWordIndex = 1
  }
  let keyWordTarget
  switch (targetType) {
    case 'int':
      keyWordTarget = parseInt(numberEdgeCases(parsedTranscription[keyWordIndex - 1]))
      break;
    case 'float':
      keyWordTarget = parseFloat(numberEdgeCases(parsedTranscription[keyWordIndex - 1]))
      break;
    default:
      keyWordTarget = parsedTranscription[keyWordIndex - 1]
      break;
  }
  

  console.log({symbol: keyWordSymbol, index: keyWordIndex, target: keyWordTarget});

  return {symbol: keyWordSymbol, index: keyWordIndex, target: keyWordTarget}
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