"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var actions_1 = require("../controllers/actions");
var router = (0, express_1.Router)();
router.post('/auth0', actions_1.auth0);
exports.default = router;
