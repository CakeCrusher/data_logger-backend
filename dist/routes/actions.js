"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var actions_1 = require("../controllers/actions");
var router = express_1.Router();
router.post('/auth0', actions_1.auth0);
router.post('/create-table', actions_1.createTable);
exports.default = router;
