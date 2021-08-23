"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var levenshtein = require('js-levenshtein');
var testParser = function (transcription) {
    var splitTable = transcription.split(' ');
    var parsedTranscription = splitTable.slice(1).filter(function (item) {
        return item !== '$';
    });
    var payload = { speech: parsedTranscription.join(' ') };
    return payload;
};
var numberEdgeCases = function (numberString) {
    switch (numberString) {
        case 'one':
            return '1';
        case 'two':
        case 'to':
        case 'too':
            return '2';
        case 'three':
        case 'tree':
            return '3';
        case 'four':
        case 'for':
            return '4';
        case 'five':
        case 'hive':
            return '5';
        case 'six':
        case 'sex':
            return '6';
        case 'seven':
            return '7';
        case 'eight':
        case 'ate':
            return '8';
        case 'nine':
            return '9';
        default:
            return numberString;
    }
};
// numberEdgeCases('to')
var keyWordInfo = function (parsedTranscription, keyWords, targetType) {
    if (targetType === void 0) { targetType = 'string'; }
    var keyWordSymbol = parsedTranscription.find(function (word) { return keyWords.find(function (keyWord) { return levenshtein(word, keyWord) < 2; }); });
    var keyWordIndex;
    if (keyWordSymbol) {
        keyWordIndex = parsedTranscription.indexOf(keyWordSymbol);
    }
    else {
        keyWordIndex = 1;
    }
    var keyWordTarget;
    switch (targetType) {
        case 'int':
            keyWordTarget = parseInt(numberEdgeCases(parsedTranscription[keyWordIndex - 1]));
            break;
        case 'float':
            keyWordTarget = parseFloat(numberEdgeCases(parsedTranscription[keyWordIndex - 1]));
            break;
        default:
            keyWordTarget = parsedTranscription[keyWordIndex - 1];
            break;
    }
    console.log({ symbol: keyWordSymbol, index: keyWordIndex, target: keyWordTarget });
    return { symbol: keyWordSymbol, index: keyWordIndex, target: keyWordTarget };
};
var runningParser = function (transcription) {
    var splitTable = transcription.split(' ');
    // get all items from splitTable but the first and exclude any items that equal '$'
    var parsedTranscription = splitTable.slice(1).filter(function (item) {
        return item !== '$';
    });
    var minuteInfo = keyWordInfo(parsedTranscription, ['minute'], 'int');
    var secondInfo = keyWordInfo(parsedTranscription, ['second'], 'int');
    var mileInfo = keyWordInfo(parsedTranscription, ['mile', 'MI'], 'float');
    var timeTarget;
    var distanceTarget;
    if (typeof minuteInfo.target === 'number' && typeof secondInfo.target === 'number') {
        timeTarget = minuteInfo.target * 60 + secondInfo.target;
    }
    if (typeof mileInfo.target === 'number') {
        distanceTarget = mileInfo.target * 1609.34;
    }
    var payload = {
        time: timeTarget,
        distance: distanceTarget,
    };
    return payload;
};
module.exports = {
    testParser: testParser,
    runningParser: runningParser,
};
