import { KeyWordInfo } from "./types"
const fs = require('fs')
const levenshtein = require('js-levenshtein');

export const numberEdgeCases = (numberString: string): string => {
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

export const keyWordInfo = (parsedTranscription: string[], keyWords: string[], targetType: string = 'string'): KeyWordInfo => {
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

export const createM4AFile = async (m4aStringified: string): Promise<String> => {
  await fs.writeFileSync('./toTranscribe.m4a', m4aStringified, {encoding: 'base64'}, (err: any) => {console.error(err)})
  console.log('File downloaded');
  return './toTranscribe.m4a'
}
export const deleteFileLocally = (fileName: string) => {
  fs.unlink(`./${fileName}`, (err: any) => {
    if (err) {
      console.error('ERROR: ', err)
      return
    }
  })
}