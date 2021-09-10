"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var transcribe_1 = require("../controllers/transcribe");
var router = (0, express_1.Router)();
router.post('/transcribe', transcribe_1.getTranscription);
exports.default = router;
