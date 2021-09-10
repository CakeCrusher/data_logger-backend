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
exports.getTranscription = void 0;
var helperFunctions_1 = require("../helperFunctions");
var _a = require('../api/cloud-storage'), uploadFile = _a.uploadFile, deleteFile = _a.deleteFile;
var transcribeRecording = require('../api/cloud-speech').transcribeRecording;
var transcriptionHandler = require('../transcriptionClassifier').transcriptionHandler;
var linear16 = require('linear16');
var fs = require('fs');
var getTranscription = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var m4aStringified, transcribe, transcription, stringifiedTranscription, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('transcribing');
                m4aStringified = req.body.audioBase64;
                // // To save a specific audio string
                // await fs.writeFileSync('./audioBase64-example.txt', m4aStringified, {encoding: 'base64'}, (err: any) => {null})
                // // To load a specific audio string
                // if (req.body.test) {
                //   console.log('Test');
                //   m4aStringified = await fs.readFileSync('./audioBase64-example.txt', {encoding: 'base64'})
                // }
                return [4 /*yield*/, (0, helperFunctions_1.createM4AFile)(m4aStringified)];
            case 1:
                // // To save a specific audio string
                // await fs.writeFileSync('./audioBase64-example.txt', m4aStringified, {encoding: 'base64'}, (err: any) => {null})
                // // To load a specific audio string
                // if (req.body.test) {
                //   console.log('Test');
                //   m4aStringified = await fs.readFileSync('./audioBase64-example.txt', {encoding: 'base64'})
                // }
                _a.sent();
                console.log('Transcribing...');
                transcribe = function (fileName) { return __awaiter(void 0, void 0, void 0, function () {
                    var convertedFilePath, convertedFileName, gcsURI, transcription;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log("translating file: " + fileName);
                                return [4 /*yield*/, linear16("./" + fileName, "./" + fileName.split('.')[0] + ".raw")];
                            case 1:
                                convertedFilePath = _a.sent();
                                convertedFileName = convertedFilePath.split('/').slice(-1)[0];
                                console.log("uploading file: " + convertedFileName);
                                return [4 /*yield*/, uploadFile(convertedFileName)];
                            case 2:
                                gcsURI = _a.sent();
                                console.log("transcribing from gcs: " + gcsURI);
                                return [4 /*yield*/, transcribeRecording(gcsURI)];
                            case 3:
                                transcription = _a.sent();
                                console.log("deleting from from gcs: " + convertedFileName);
                                return [4 /*yield*/, deleteFile(convertedFileName)];
                            case 4:
                                _a.sent();
                                console.log(convertedFileName);
                                (0, helperFunctions_1.deleteFileLocally)(convertedFileName);
                                (0, helperFunctions_1.deleteFileLocally)('toTranscribe.m4a');
                                return [2 /*return*/, transcription];
                        }
                    });
                }); };
                return [4 /*yield*/, transcribe('toTranscribe.m4a')];
            case 2:
                transcription = _a.sent();
                console.log('transcription: ', JSON.stringify(transcription));
                stringifiedTranscription = transcription.map(function (portion) { return portion.alternatives[0].transcript; }).join(' $ ');
                console.log('stringifiedTranscription: ', stringifiedTranscription);
                result = transcriptionHandler(stringifiedTranscription);
                console.log('result: ', result);
                res.json(result);
                return [2 /*return*/];
        }
    });
}); };
exports.getTranscription = getTranscription;
