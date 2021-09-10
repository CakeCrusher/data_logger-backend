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
exports.createTable = exports.auth0 = void 0;
var helperFunctions_1 = require("../helperFunctions");
var schemas_1 = require("../schemas");
var fetch = require('node-fetch');
var AuthenticationClient = require('auth0').AuthenticationClient;
var getAuthManagagementApiToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var promise, managementApiToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                promise = new Promise(function (resolve, reject) {
                    var auth0 = new AuthenticationClient({
                        domain: process.env.AUTH_DOMAIN,
                        clientId: process.env.API_CLIENT_ID,
                        clientSecret: process.env.API_CLIENT_SECRET,
                    });
                    auth0.clientCredentialsGrant({
                        audience: "https://" + process.env.AUTH_DOMAIN + "/api/v2/",
                    }, function (err, response) {
                        if (err) {
                            console.log('ERROR: ', err);
                        }
                        else {
                            console.log('response.access_token: ', response.access_token.slice(0, 10));
                            resolve(response.access_token);
                        }
                    });
                });
                return [4 /*yield*/, promise];
            case 1:
                managementApiToken = _a.sent();
                return [2 /*return*/, managementApiToken];
        }
    });
}); };
var getProfileInfo = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var managementApiToken, _a, AUTH0_DOMAIN, headers, profileAPI, profileInfo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!Boolean(process.env.DEVELOPMENT)) return [3 /*break*/, 1];
                _a = process.env.AUTH_MANAGEMENT_API_TOKEN;
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, getAuthManagagementApiToken()];
            case 2:
                _a = _b.sent();
                _b.label = 3;
            case 3:
                managementApiToken = _a;
                AUTH0_DOMAIN = process.env.AUTH_DOMAIN;
                headers = { 'Authorization': "Bearer " + managementApiToken };
                profileAPI = "https://" + AUTH0_DOMAIN + "/api/v2/users/" + user_id;
                return [4 /*yield*/, fetch(profileAPI, { headers: headers }).then(function (res) { return res.json(); })];
            case 4:
                profileInfo = _b.sent();
                return [2 /*return*/, profileInfo];
        }
    });
}); };
var auth0 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session_variables, user_id, profileInfo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                session_variables = req.body.session_variables;
                user_id = session_variables['x-hasura-user-id'];
                return [4 /*yield*/, getProfileInfo(user_id)];
            case 1:
                profileInfo = _a.sent();
                console.log(profileInfo);
                return [2 /*return*/, res.json({
                        id: profileInfo.user_id,
                        name: profileInfo.nickname,
                        email: profileInfo.email,
                    })];
        }
    });
}); };
exports.auth0 = auth0;
var createTable = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, input, createCustomTableRes, customTableId, createTableRes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('creating table');
                user_id = req.body.session_variables['x-hasura-user-id'];
                input = req.body.input;
                return [4 /*yield*/, helperFunctions_1.fetchGraphQL(schemas_1.CREATE_CUSTOMTABLE, {
                        name: input.name,
                        user_id: user_id
                    })];
            case 1:
                createCustomTableRes = _a.sent();
                if (!createCustomTableRes.data) {
                    return [2 /*return*/, res.status(401)];
                }
                customTableId = createCustomTableRes.data.insert_customtable.returning[0].id;
                console.log('customTableId: ', customTableId);
                console.log(createCustomTableRes);
                return [4 /*yield*/, input.fields.forEach(function (field) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, helperFunctions_1.fetchGraphQL(schemas_1.CREATE_CTFIELD, {
                                        label: field.label,
                                        type: field.type,
                                        customtable: customTableId,
                                    })];
                                case 1:
                                    res = _a.sent();
                                    console.log('made field');
                                    if (!res.data) {
                                        return [2 /*return*/, res.status(401)];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 2:
                _a.sent();
                return [4 /*yield*/, fetch('https://data-logger.hasura.app/v1/query', {
                        method: 'POST',
                        body: JSON.stringify(helperFunctions_1.createTableBody(input, user_id)),
                        headers: {
                            "content-type": "application/json",
                            "x-hasura-admin-secret": "3fVAMs0P7prKMOzAUb4uUoJF9eTrbPTh0X9sqe6vGnECNT0AHa3Bkyndf81V6pS4"
                        }
                    })];
            case 3:
                createTableRes = _a.sent();
                console.log('made table res: ', createTableRes);
                return [2 /*return*/, res.json({
                        tableName: user_id + "_" + input.name,
                    })];
        }
    });
}); };
exports.createTable = createTable;
