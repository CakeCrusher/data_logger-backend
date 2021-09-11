"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var levenshtein = require('js-levenshtein');
var _a = require('./tableParsers'), testParser = _a.testParser, runningParser = _a.runningParser;
var transcriptionHandler = function (transcription) {
    var tables = ['testing', 'running'];
    var transcribedTable = transcription.split(' ')[0];
    var closestTable = tables.reduce(function (acc, table) {
        var distance = levenshtein(transcribedTable, table);
        return distance < acc.distance ? { distance: distance, table: table } : acc;
    }, { distance: 3, table: 'ERROR' }).table;
    console.log(closestTable);
    var payload = {};
    switch (closestTable) {
        case 'testing':
            payload = testParser(transcription);
            break;
        case 'running':
            payload = runningParser(transcription);
            break;
        default:
            null;
            break;
    }
    var hasNull = Object.keys(payload).find(function (key) { return !payload[key]; });
    if (hasNull) {
        return {
            table: 'ERROR',
            dateTime: new Date().toISOString(),
            payload: payload
        };
    }
    return {
        table: closestTable,
        dateTime: new Date().toISOString(),
        payload: payload
    };
};
module.exports = { transcriptionHandler: transcriptionHandler };
