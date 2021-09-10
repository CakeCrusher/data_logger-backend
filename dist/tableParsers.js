"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helperFunctions_1 = require("./helperFunctions");
var levenshtein = require('js-levenshtein');
var testParser = function (transcription) {
    var splitTable = transcription.split(' ');
    var parsedTranscription = splitTable.slice(1).filter(function (item) {
        return item !== '$';
    });
    var payload = { speech: parsedTranscription.join(' ') };
    return payload;
};
var runningParser = function (transcription) {
    var splitTable = transcription.split(' ');
    // get all items from splitTable but the first and exclude any items that equal '$'
    var parsedTranscription = splitTable.slice(1).filter(function (item) {
        return item !== '$';
    });
    var minuteInfo = (0, helperFunctions_1.keyWordInfo)(parsedTranscription, ['minute'], 'int');
    var secondInfo = (0, helperFunctions_1.keyWordInfo)(parsedTranscription, ['second'], 'int');
    var mileInfo = (0, helperFunctions_1.keyWordInfo)(parsedTranscription, ['mile', 'MI'], 'float');
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
