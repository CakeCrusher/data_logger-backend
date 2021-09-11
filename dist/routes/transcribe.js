"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var transcribe_1 = require("../controllers/transcribe");
var router = express_1.Router();
router.post('/transcribe', transcribe_1.getTranscription);
router.post('/classify', transcribe_1.classifyTranscription);
exports.default = router;
