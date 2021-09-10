"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileLocally = exports.createM4AFile = exports.keyWordInfo = exports.numberEdgeCases = void 0;
var fs = require('fs');
var levenshtein = require('js-levenshtein');
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
exports.numberEdgeCases = numberEdgeCases;
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
            keyWordTarget = parseInt((0, exports.numberEdgeCases)(parsedTranscription[keyWordIndex - 1]));
            break;
        case 'float':
            keyWordTarget = parseFloat((0, exports.numberEdgeCases)(parsedTranscription[keyWordIndex - 1]));
            break;
        default:
            keyWordTarget = parsedTranscription[keyWordIndex - 1];
            break;
    }
    console.log({ symbol: keyWordSymbol, index: keyWordIndex, target: keyWordTarget });
    return { symbol: keyWordSymbol, index: keyWordIndex, target: keyWordTarget };
};
exports.keyWordInfo = keyWordInfo;
var createM4AFile = function (m4aStringified) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.writeFileSync('./toTranscribe.m4a', m4aStringified, { encoding: 'base64' }, function (err) { console.error(err); })];
            case 1:
                _a.sent();
                console.log('File downloaded');
                return [2 /*return*/, './toTranscribe.m4a'];
        }
    });
}); };
exports.createM4AFile = createM4AFile;
var deleteFileLocally = function (fileName) {
    fs.unlink("./" + fileName, function (err) {
        if (err) {
            console.error('ERROR: ', err);
            return;
        }
    });
};
exports.deleteFileLocally = deleteFileLocally;
