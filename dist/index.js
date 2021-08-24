"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var fs = require('fs');
var linear16 = require('linear16');
var _a = require('./api/cloud-storage'), uploadFile = _a.uploadFile, deleteFile = _a.deleteFile;
var transcribeRecording = require('./api/cloud-speech').transcribeRecording;
var transcriptionHandler = require('./transcriptionClassifier').transcriptionHandler;
var transcribe_1 = __importDefault(require("./routes/transcribe"));
var app = express();
app.use(express.json({ limit: '50mb' }));
var PORT = process.env.PORT || 3000;
app.use(transcribe_1.default);
app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
