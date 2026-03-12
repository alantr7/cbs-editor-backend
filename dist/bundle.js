/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts"
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const express = __importStar(__webpack_require__(/*! express */ "express"));
const routes_1 = __webpack_require__(/*! ./routes */ "./src/routes.ts");
const dotenv_1 = __webpack_require__(/*! dotenv */ "dotenv");
const cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ "cookie-parser"));
(0, dotenv_1.configDotenv)();
const app = express.default();
app.use((0, cookie_parser_1.default)());
app.use(express.json());
(0, routes_1.setupRoutes)(app);
app.listen(process.env.PORT);


/***/ },

/***/ "./src/controllers/server-controller.ts"
/*!**********************************************!*\
  !*** ./src/controllers/server-controller.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleServerCreate = void 0;
const jwt_1 = __webpack_require__(/*! ../utils/jwt */ "./src/utils/jwt.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const handleServerCreate = (req, res) => {
    const version = req.body.version;
    if (typeof version !== 'string') {
        res.status(401).end();
        return;
    }
    res.status(200).send((0, jwt_1.createToken)({
        id: (0, uuid_1.v7)(),
        version,
    }, 3 * 60 * 60));
};
exports.handleServerCreate = handleServerCreate;


/***/ },

/***/ "./src/controllers/session-controller.ts"
/*!***********************************************!*\
  !*** ./src/controllers/session-controller.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handleSessionUpdate = exports.handleSessionGet = exports.handleDemoSessionGet = exports.handleSessionCreate = void 0;
const database_1 = __webpack_require__(/*! ../database */ "./src/database.ts");
const demo_1 = __webpack_require__(/*! ../demo */ "./src/demo.ts");
const jwt_1 = __webpack_require__(/*! ../utils/jwt */ "./src/utils/jwt.ts");
const versions_1 = __webpack_require__(/*! ../utils/versions */ "./src/utils/versions.ts");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const handleSessionCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers["authorization"];
    if (authorization === undefined || !(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith("Bearer "))) {
        res.status(401).end();
        return;
    }
    const token = authorization.substring("Bearer ".length);
    const claims = (0, jwt_1.verifyToken)(token);
    if (claims === null) {
        res.status(401).end();
        return;
    }
    const { id, version: rawVersion } = claims;
    const version = versions_1.Version.from(rawVersion);
    const sessionFiles = [];
    if (version.isOlderThan(versions_1.Version.V_0_5_1_MULTIPLE_FILES_EDITING)) {
        const content = req.body.file;
        if (typeof content !== 'string') {
            res.status(400).end();
            return;
        }
        sessionFiles.push({
            id: (0, uuid_1.v7)(),
            name: "program.cbf",
            content,
            // @ts-ignore
            last_change_id: "",
            last_change_timestamp: 0
        });
    }
    else {
        const files = req.body.files;
        if (!Array.isArray(files)) {
            res.status(400).end();
            return;
        }
        for (const file of files) {
            sessionFiles.push({
                id: (0, uuid_1.v7)(),
                name: file.name,
                content: file.content,
                last_modified: 0
            });
        }
    }
    res.json(Object.assign({}, (yield (0, database_1.create_session)(id, rawVersion, req.body.modules, sessionFiles))));
});
exports.handleSessionCreate = handleSessionCreate;
const handleDemoSessionGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(Object.assign(Object.assign({}, demo_1.demoSession), { last_modified: Date.now(), expires_at: Date.now() + 3 * 60 * 60 * 1000 }));
});
exports.handleDemoSessionGet = handleDemoSessionGet;
const handleSessionGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.sessionId;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.substring("Bearer ".length);
    // Check if access token is present in cookies
    if (typeof accessToken !== 'string') {
        res.status(401).end();
        return;
    }
    // Check if the access token is valid
    const claims = (0, jwt_1.verifyToken)(accessToken);
    if (claims == null) {
        res.status(401).end();
        return;
    }
    // Check if the claims are valid
    const time = Date.now();
    if (time >= claims.expires_at || claims.id !== id) {
        res.status(403).end();
        return;
    }
    const session = (yield (0, database_1.get_session)(id));
    if (session === undefined || session === null) {
        res.status(404).end();
        return;
    }
    // Check if the tokens match
    if (session.access_token !== accessToken) {
        res.status(403).end();
        return;
    }
    const plugin_version = versions_1.Version.from(session.plugin_version);
    // Check if there are changes if "last_change_id" is present
    if (req.query.last_modified && session.last_modified === parseInt(req.query.last_modified)) {
        res.status(304).end();
        return;
    }
    const result = {};
    if (plugin_version.isOlderThan(versions_1.Version.V_0_5_1_MULTIPLE_FILES_EDITING)) {
        result["content"] = session.files[0].content;
        result["last_change_id"] = session.files[0].last_modified.toString();
        result["last_change_timestamp"] = session.files[0].last_modified;
    }
    else {
        result.id = session.id;
        result.modules = JSON.parse(session.modules);
        result.files = session.files;
        result.last_modified = session.last_modified;
        result.expires_at = session.expires_at;
    }
    res.json(result);
});
exports.handleSessionGet = handleSessionGet;
const handleSessionUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.sessionId;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.substring("Bearer ".length);
    // Check if access token is present in cookies
    if (typeof accessToken !== 'string') {
        res.status(401).end();
        return;
    }
    // Check if the access token is valid
    const claims = (0, jwt_1.verifyToken)(accessToken);
    if (claims == null) {
        res.status(401).end();
        return;
    }
    // Check if the claims are valid
    const time = Date.now();
    if (time >= claims.expires_at || claims.id !== id) {
        res.status(403).end();
        return;
    }
    const session = (yield (0, database_1.get_session)(id));
    if (session === undefined || session === null) {
        res.status(404).end();
        return;
    }
    // Check if the tokens match
    if (session.access_token !== accessToken) {
        res.status(403).end();
        return;
    }
    const plugin_version = versions_1.Version.from(session.plugin_version);
    const { files } = req.body;
    if (!Array.isArray(files)) {
        res.status(400).end();
        return;
    }
    const lastModified = Date.now();
    session.last_modified = lastModified;
    // Check if files are valid
    for (const file of files) {
        if (typeof file.content !== 'string' || file.content.length > 2048) {
            res.status(400).end();
            return;
        }
        const sessionFile = session.files.find(f => f.id === file.id);
        if (sessionFile === undefined) {
            res.status(400).end();
            return;
        }
        sessionFile.content = file.content;
        sessionFile.last_modified = lastModified;
        yield (0, database_1.update_session_file)(sessionFile);
    }
    yield (0, database_1.update_session)(session);
    res.status(200).end();
});
exports.handleSessionUpdate = handleSessionUpdate;


/***/ },

/***/ "./src/database.ts"
/*!*************************!*\
  !*** ./src/database.ts ***!
  \*************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.delete_expired_sessions = exports.update_session = exports.update_session_file = exports.create_session = exports.get_session = void 0;
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const jwt_1 = __webpack_require__(/*! ./utils/jwt */ "./src/utils/jwt.ts");
const better_sqlite3_1 = __importDefault(__webpack_require__(/*! better-sqlite3 */ "better-sqlite3"));
const fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
!fs_1.default.existsSync(`./storage`) && fs_1.default.mkdirSync(`./storage`);
const dataDirectory = fs_1.default.realpathSync('./storage');
const database = (0, better_sqlite3_1.default)(dataDirectory + "/sessions.db", {
    fileMustExist: false,
    readonly: false
});
database.pragma("journal_mode = WAL");
// Setup the database
database.exec(`CREATE TABLE IF NOT EXISTS sessions (id PRIMARY KEY, server_id TEXT, plugin_version TEXT, access_token TEXT, modules TEXT, created_at BIGINT, expires_at BIGINT, last_modified BIGINT)`);
database.exec(`CREATE TABLE IF NOT EXISTS sessions_contents (id PRIMARY KEY, name VARCHAR(24), session_id TEXT, content TEXT(2048), last_modified BIGINT)`);
const get_session = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, rej) => {
        const result = database.prepare("SELECT * FROM sessions WHERE id = ? LIMIT 1").get(id);
        const files = database.prepare("SELECT * FROM sessions_contents WHERE session_id = ?").all(id) || [];
        if (result) {
            resolve(Object.assign(Object.assign({}, result), { files }));
        }
    });
});
exports.get_session = get_session;
const create_session = (server_id, plugin_version, modules, files) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, uuid_1.v7)();
    const duration = 3600 * 2;
    const expires_at = Date.now() + duration * 1000;
    const session = {
        id,
        files,
        server_id,
        plugin_version,
        access_token: (0, jwt_1.createToken)({
            id,
            server_id,
            expires_at
        }, duration),
        created_at: Date.now(),
        expires_at,
        modules: JSON.stringify(modules),
        last_modified: 0
    };
    console.log(session);
    return new Promise((resolve, rej) => {
        const stmt = database.prepare(`INSERT INTO sessions (id, server_id, plugin_version, access_token, modules, created_at, expires_at, last_modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        const results = stmt.run(session.id, server_id, session.plugin_version, session.access_token, session.modules, session.created_at, session.expires_at, 0);
        const stmtFiles = database.prepare(`INSERT INTO sessions_contents (id, name, session_id, content, last_modified) VALUES (?, ?, ?, ?, ?)`);
        files.forEach(file => {
            stmtFiles.run(file.id, file.name, session.id, file.content, file.last_modified);
        });
        if (results.changes !== 0) {
            resolve(session);
        }
        else {
            rej();
        }
    });
});
exports.create_session = create_session;
const update_session_file = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, rej) => {
        const query = database.prepare(`update sessions_contents set content = ?, last_modified = ? where id = ?`).run(file.content, file.last_modified, file.id);
        if (query.changes !== 0) {
            resolve(file);
        }
        else {
            rej();
        }
    });
});
exports.update_session_file = update_session_file;
const update_session = (session) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, rej) => {
        const query = database.prepare(`update sessions set last_modified = ? where id = ?`).run(session.last_modified, session.id);
        if (query.changes !== 0) {
            resolve(session);
        }
        else {
            rej();
        }
    });
});
exports.update_session = update_session;
const delete_expired_sessions = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, rej) => {
        const time = Date.now();
        database.prepare(`DELETE FROM sessions_contents WHERE expires_at < ?`).run(time);
        database.prepare(`DELETE FROM sessions WHERE expires_at < ?`).run(time);
        resolve();
    });
});
exports.delete_expired_sessions = delete_expired_sessions;


/***/ },

/***/ "./src/demo.ts"
/*!*********************!*\
  !*** ./src/demo.ts ***!
  \*********************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.demoSession = void 0;
;
const demoCode = `
import bot;

int main() {
   bot.chat("Hello World!");
   return 0;
}
`.trim();
exports.demoSession = {
    id: "demo",
    modules: {
        bot: {
            name: "bot",
            functions: [
                { module: "bot", name: "chat", return_type: "int", parameter_types: ["string"], completion: "chat($1)$0" },
                { module: "bot", name: "deposit_item", return_type: "int", parameter_types: ["string"], completion: "deposit_item($1)$0" },
                { module: "bot", name: "get_block", return_type: "string", parameter_types: ["string"], completion: "get_block($1)$0" },
                { module: "bot", name: "get_direction", return_type: "string", parameter_types: [], completion: "get_direction()$0" },
                { module: "bot", name: "get_item", return_type: "string", parameter_types: [], completion: "get_item()$0" },
                { module: "bot", name: "get_selected_slot", return_type: "number", parameter_types: [], completion: "get_selected_slot()$0" },
                { module: "bot", name: "move", return_type: "int", parameter_types: ["string"], completion: "move($1)$0" },
                { module: "bot", name: "print", return_type: "int", parameter_types: ["string"], completion: "print($1)$0" },
                { module: "bot", name: "rotate_left", return_type: "int", parameter_types: [], completion: "rotate_left()$0" },
                { module: "bot", name: "rotate_right", return_type: "int", parameter_types: [], completion: "rotate_right()$0" },
                { module: "bot", name: "select_slot", return_type: "int", parameter_types: ["int"], completion: "select_slot($1)$0" },
                { module: "bot", name: "set_status", return_type: "int", parameter_types: ["string", "int"], completion: "set_status($1, $2)$0" },
            ]
        },
        math: {
            name: "math",
            functions: [
                { module: "math", name: "ceil", return_type: "float", parameter_types: ["float"], completion: "ceil($1)$0" },
                { module: "math", name: "cos", return_type: "float", parameter_types: ["float"], completion: "cos($1)$0" },
                { module: "math", name: "floor", return_type: "float", parameter_types: ["float"], completion: "floor($1)$0" },
                { module: "math", name: "round", return_type: "float", parameter_types: ["float"], completion: "round($1)$0" },
                { module: "math", name: "sin", return_type: "float", parameter_types: ["float"], completion: "sin($1)$0" },
                { module: "math", name: "sqrt", return_type: "float", parameter_types: ["float"], completion: "sqrt($1)$0" },
            ]
        },
        lang: {
            name: "lang",
            functions: [
                { module: null, name: "strlen", return_type: "int", parameter_types: ["string"], completion: "strlen($1)$0" },
                { module: null, name: "is_int", return_type: "int", parameter_types: ["string"], completion: "is_int($1)$0" },
                { module: null, name: "to_int", return_type: "int", parameter_types: ["string"], completion: "to_int($1)$0" },
                { module: null, name: "is_float", return_type: "int", parameter_types: ["string"], completion: "is_float($1)$0" },
                { module: null, name: "to_float", return_type: "float", parameter_types: ["string"], completion: "to_float($1)$0" },
            ]
        }
    },
    files: [{ id: "main.cbs", name: "main.cbs", last_modified: Date.now(), content: demoCode }],
    last_modified: 0,
    expires_at: 0,
};


/***/ },

/***/ "./src/routes.ts"
/*!***********************!*\
  !*** ./src/routes.ts ***!
  \***********************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setupRoutes = setupRoutes;
const server_controller_1 = __webpack_require__(/*! ./controllers/server-controller */ "./src/controllers/server-controller.ts");
const session_controller_1 = __webpack_require__(/*! ./controllers/session-controller */ "./src/controllers/session-controller.ts");
function setupRoutes(express) {
    express.post("/api/servers", server_controller_1.handleServerCreate);
    express.post("/api/sessions", session_controller_1.handleSessionCreate);
    express.get("/api/sessions/demo", session_controller_1.handleDemoSessionGet);
    express.get("/api/sessions/:sessionId", session_controller_1.handleSessionGet);
    express.put("/api/sessions/:sessionId", session_controller_1.handleSessionUpdate);
}


/***/ },

/***/ "./src/utils/jwt.ts"
/*!**************************!*\
  !*** ./src/utils/jwt.ts ***!
  \**************************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createToken = createToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken"));
function createToken(payload, timeValid) {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: Date.now() + timeValid
    });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (_a) {
        return null;
    }
}


/***/ },

/***/ "./src/utils/versions.ts"
/*!*******************************!*\
  !*** ./src/utils/versions.ts ***!
  \*******************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Version = void 0;
class Version {
    constructor(segments, channel) {
        this.segments = segments;
        this.channel = channel;
        this.stringified = segments.join(".") + Version.getChannelChar(channel);
    }
    static from(input) {
        if (!Version.VERSION_REGEX.test(input)) {
            return Version.INVALID;
        }
        let channel;
        if (input.endsWith("a") || input.endsWith("b")) {
            channel = input.endsWith("a") ? Version.ALPHA : Version.BETA;
            input = input.slice(0, -1);
        }
        else {
            channel = Version.RELEASE;
        }
        const rawSegments = input.includes(".") ? input.split(".") : [input];
        const segments = rawSegments.map(Version.toSegment);
        return new Version(segments, channel);
    }
    static toSegment(input) {
        return parseInt(input, 10);
    }
    isValid() {
        return this !== Version.INVALID;
    }
    isOlderThan(version) {
        return this.compare(version) < 0;
    }
    isNewerThan(version) {
        return this.compare(version) > 0;
    }
    compare(version) {
        if (this === Version.INVALID)
            return -1;
        if (version === Version.INVALID)
            return 1;
        const minLength = Math.min(this.segments.length, version.segments.length);
        for (let i = 0; i < minLength; i++) {
            if (this.segments[i] < version.segments[i])
                return -1;
            if (this.segments[i] > version.segments[i])
                return 1;
        }
        if (this.segments.length === version.segments.length) {
            return Version.compareChannel(this.channel, version.channel);
        }
        const greaterSegment = this.segments.length === minLength ? version.segments : this.segments;
        for (let i = minLength; i < greaterSegment.length; i++) {
            if (greaterSegment[i] !== 0) {
                return greaterSegment === this.segments ? 1 : -1;
            }
        }
        return Version.compareChannel(this.channel, version.channel);
    }
    static compareChannel(ch1, ch2) {
        return ch1 - ch2;
    }
    static getChannelChar(channel) {
        switch (channel) {
            case Version.ALPHA:
                return "a";
            case Version.BETA:
                return "b";
            default:
                return "";
        }
    }
}
exports.Version = Version;
Version.ALPHA = 0;
Version.BETA = 1;
Version.RELEASE = 255;
Version.VERSION_REGEX = /^\d+(\.\d+)*[ab]?$/;
Version.INVALID = new Version([], Version.ALPHA);
Version.V_0_5_1_MULTIPLE_FILES_EDITING = Version.from("0.5.1");


/***/ },

/***/ "better-sqlite3"
/*!*********************************!*\
  !*** external "better-sqlite3" ***!
  \*********************************/
(module) {

module.exports = require("better-sqlite3");

/***/ },

/***/ "cookie-parser"
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
(module) {

module.exports = require("cookie-parser");

/***/ },

/***/ "dotenv"
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
(module) {

module.exports = require("dotenv");

/***/ },

/***/ "express"
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
(module) {

module.exports = require("express");

/***/ },

/***/ "jsonwebtoken"
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
(module) {

module.exports = require("jsonwebtoken");

/***/ },

/***/ "uuid"
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
(module) {

module.exports = require("uuid");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

module.exports = require("fs");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFTSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQWE7UUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDckMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzNCLENBQUM7UUFDRCxJQUFJLE9BQWUsQ0FBQztRQUNwQixJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQzdDLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQzdELEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUM7YUFBTSxDQUFDO1lBQ0osT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDOUIsQ0FBQztRQUVELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckUsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFcEQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVPLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBYTtRQUNsQyxPQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVNLE9BQU87UUFDVixPQUFPLElBQUksS0FB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QyxLQUFLLENBQUMsQ0FBQztBQUVsRCxzQ0FBOEIsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7Ozs7OztBQ1JsRiwyQzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7OztBQ0FBLHlDOzs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRTVCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kLy4vc3JjL2NvbnRyb2xsZXJzL3NlcnZlci1jb250cm9sbGVyLnRzIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC8uL3NyYy9jb250cm9sbGVycy9zZXNzaW9uLWNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kLy4vc3JjL2RhdGFiYXNlLnRzIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC8uL3NyYy9kZW1vLnRzIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC8uL3NyYy9yb3V0ZXMudHMiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kLy4vc3JjL3V0aWxzL2p3dC50cyIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvLi9zcmMvdXRpbHMvdmVyc2lvbnMudHMiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwiYmV0dGVyLXNxbGl0ZTNcIiIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJjb29raWUtcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwiZXhwcmVzc1wiIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImpzb253ZWJ0b2tlblwiIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcInV1aWRcIiIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImZzXCIiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgeyBzZXR1cFJvdXRlcyB9IGZyb20gXCIuL3JvdXRlc1wiO1xuaW1wb3J0IHsgY29uZmlnRG90ZW52IH0gZnJvbSBcImRvdGVudlwiO1xuaW1wb3J0IGNvb2tpZVBhcnNlciBmcm9tIFwiY29va2llLXBhcnNlclwiO1xuXG5jb25maWdEb3RlbnYoKTtcblxuY29uc3QgYXBwID0gZXhwcmVzcy5kZWZhdWx0KCk7XG5hcHAudXNlKGNvb2tpZVBhcnNlcigpKTtcbmFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xuXG5zZXR1cFJvdXRlcyhhcHApO1xuXG5hcHAubGlzdGVuKHByb2Nlc3MuZW52LlBPUlQpOyIsImltcG9ydCB7IGNyZWF0ZVRva2VuIH0gZnJvbSBcIi4uL3V0aWxzL2p3dFwiO1xuaW1wb3J0IHsgdjcgYXMgdXVpZCB9IGZyb20gXCJ1dWlkXCI7XG5pbXBvcnQgeyBKd3RTZXJ2ZXJDbGFpbXMgfSBmcm9tIFwiLi4vdHlwZXMvand0LWNsYWltcy10eXBlc1wiO1xuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi90eXBlcy9jb250cm9sbGVyXCI7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTZXJ2ZXJDcmVhdGU6IENvbnRyb2xsZXIgPSAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCB2ZXJzaW9uID0gcmVxLmJvZHkudmVyc2lvbjtcbiAgICBpZiAodHlwZW9mIHZlcnNpb24gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKFxuICAgICAgICBjcmVhdGVUb2tlbjxKd3RTZXJ2ZXJDbGFpbXM+KHtcbiAgICAgICAgICAgIGlkOiB1dWlkKCksXG4gICAgICAgICAgICB2ZXJzaW9uLFxuICAgICAgICB9LCAzICogNjAgKiA2MClcbiAgICApO1xufSIsImltcG9ydCB7IGNyZWF0ZV9zZXNzaW9uLCBnZXRfc2Vzc2lvbiwgdXBkYXRlX3Nlc3Npb24sIHVwZGF0ZV9zZXNzaW9uX2ZpbGUgfSBmcm9tIFwiLi4vZGF0YWJhc2VcIjtcbmltcG9ydCB7IGRlbW9TZXNzaW9uIH0gZnJvbSBcIi4uL2RlbW9cIjtcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vdHlwZXMvY29udHJvbGxlclwiXG5pbXBvcnQgeyBKd3RFZGl0b3JTZXNzaW9uQ2xhaW1zLCBKd3RTZXJ2ZXJDbGFpbXMgfSBmcm9tIFwiLi4vdHlwZXMvand0LWNsYWltcy10eXBlc1wiO1xuaW1wb3J0IHsgRGF0YWJhc2VTZXNzaW9uLCBEYXRhYmFzZVNlc3Npb25GaWxlIH0gZnJvbSBcIi4uL3V0aWxzL2RibW9kZWxzXCI7XG5pbXBvcnQgeyB2ZXJpZnlUb2tlbiB9IGZyb20gXCIuLi91dGlscy9qd3RcIjtcbmltcG9ydCB7IFZlcnNpb24gfSBmcm9tIFwiLi4vdXRpbHMvdmVyc2lvbnNcIjtcbmltcG9ydCB7IHY3IGFzIHV1aWQgfSBmcm9tIFwidXVpZFwiO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlU2Vzc2lvbkNyZWF0ZTogQ29udHJvbGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGF1dGhvcml6YXRpb24gPSByZXEuaGVhZGVyc1tcImF1dGhvcml6YXRpb25cIl07XG4gICAgaWYgKGF1dGhvcml6YXRpb24gPT09IHVuZGVmaW5lZCB8fCAhYXV0aG9yaXphdGlvbj8uc3RhcnRzV2l0aChcIkJlYXJlciBcIikpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdG9rZW4gPSBhdXRob3JpemF0aW9uLnN1YnN0cmluZyhcIkJlYXJlciBcIi5sZW5ndGgpO1xuICAgIGNvbnN0IGNsYWltcyA9IHZlcmlmeVRva2VuPEp3dFNlcnZlckNsYWltcz4odG9rZW4pO1xuXG4gICAgaWYgKGNsYWltcyA9PT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGlkLCB2ZXJzaW9uOiByYXdWZXJzaW9uIH0gPSBjbGFpbXM7XG4gICAgY29uc3QgdmVyc2lvbiA9IFZlcnNpb24uZnJvbShyYXdWZXJzaW9uKTtcblxuICAgIGNvbnN0IHNlc3Npb25GaWxlczogRGF0YWJhc2VTZXNzaW9uRmlsZVtdID0gW107XG4gICAgaWYgKHZlcnNpb24uaXNPbGRlclRoYW4oVmVyc2lvbi5WXzBfNV8xX01VTFRJUExFX0ZJTEVTX0VESVRJTkcpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSByZXEuYm9keS5maWxlO1xuICAgICAgICBpZiAodHlwZW9mIGNvbnRlbnQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXNzaW9uRmlsZXMucHVzaCh7XG4gICAgICAgICAgICBpZDogdXVpZCgpLFxuICAgICAgICAgICAgbmFtZTogXCJwcm9ncmFtLmNiZlwiLFxuICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgIGxhc3RfY2hhbmdlX2lkOiBcIlwiLFxuICAgICAgICAgICAgbGFzdF9jaGFuZ2VfdGltZXN0YW1wOiAwXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gcmVxLmJvZHkuZmlsZXMgYXMgRGF0YWJhc2VTZXNzaW9uRmlsZVtdO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZmlsZXMpKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICAgIHNlc3Npb25GaWxlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpZDogdXVpZCgpLFxuICAgICAgICAgICAgICAgIG5hbWU6IGZpbGUubmFtZSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBmaWxlLmNvbnRlbnQsXG4gICAgICAgICAgICAgICAgbGFzdF9tb2RpZmllZDogMFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXMuanNvbih7XG4gICAgICAgIC4uLihhd2FpdCBjcmVhdGVfc2Vzc2lvbihpZCBhcyBzdHJpbmcsIHJhd1ZlcnNpb24sIHJlcS5ib2R5Lm1vZHVsZXMsIHNlc3Npb25GaWxlcykpXG4gICAgfSlcbn07XG5cblxuZXhwb3J0IGNvbnN0IGhhbmRsZURlbW9TZXNzaW9uR2V0OiBDb250cm9sbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24oe1xuICAgICAgICAuLi5kZW1vU2Vzc2lvbixcbiAgICAgICAgbGFzdF9tb2RpZmllZDogRGF0ZS5ub3coKSxcbiAgICAgICAgZXhwaXJlc19hdDogRGF0ZS5ub3coKSArIDMgKiA2MCAqIDYwICogMTAwMCxcbiAgICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTZXNzaW9uR2V0OiBDb250cm9sbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgaWQgPSByZXEucGFyYW1zLnNlc3Npb25JZCBhcyBzdHJpbmc7XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uPy5zdWJzdHJpbmcoXCJCZWFyZXIgXCIubGVuZ3RoKTtcblxuICAgIC8vIENoZWNrIGlmIGFjY2VzcyB0b2tlbiBpcyBwcmVzZW50IGluIGNvb2tpZXNcbiAgICBpZiAodHlwZW9mIGFjY2Vzc1Rva2VuICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgYWNjZXNzIHRva2VuIGlzIHZhbGlkXG4gICAgY29uc3QgY2xhaW1zID0gdmVyaWZ5VG9rZW48Snd0RWRpdG9yU2Vzc2lvbkNsYWltcz4oYWNjZXNzVG9rZW4pO1xuICAgIGlmIChjbGFpbXMgPT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgY2xhaW1zIGFyZSB2YWxpZFxuICAgIGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGlmICh0aW1lID49IGNsYWltcy5leHBpcmVzX2F0IHx8IGNsYWltcy5pZCAhPT0gaWQpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDMpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2Vzc2lvbiA9IChhd2FpdCBnZXRfc2Vzc2lvbihpZCkpIGFzIERhdGFiYXNlU2Vzc2lvbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgaWYgKHNlc3Npb24gPT09IHVuZGVmaW5lZCB8fCBzZXNzaW9uID09PSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDA0KS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSB0b2tlbnMgbWF0Y2hcbiAgICBpZiAoc2Vzc2lvbi5hY2Nlc3NfdG9rZW4gIT09IGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAzKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBwbHVnaW5fdmVyc2lvbiA9IFZlcnNpb24uZnJvbShzZXNzaW9uLnBsdWdpbl92ZXJzaW9uKTtcblxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBjaGFuZ2VzIGlmIFwibGFzdF9jaGFuZ2VfaWRcIiBpcyBwcmVzZW50XG4gICAgaWYgKHJlcS5xdWVyeS5sYXN0X21vZGlmaWVkICYmIHNlc3Npb24ubGFzdF9tb2RpZmllZCA9PT0gcGFyc2VJbnQocmVxLnF1ZXJ5Lmxhc3RfbW9kaWZpZWQgYXMgc3RyaW5nKSkge1xuICAgICAgICByZXMuc3RhdHVzKDMwNCkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQ6IGFueSA9IHt9O1xuICAgIGlmIChwbHVnaW5fdmVyc2lvbi5pc09sZGVyVGhhbihWZXJzaW9uLlZfMF81XzFfTVVMVElQTEVfRklMRVNfRURJVElORykpIHtcbiAgICAgICAgcmVzdWx0W1wiY29udGVudFwiXSA9IHNlc3Npb24uZmlsZXNbMF0uY29udGVudDtcbiAgICAgICAgcmVzdWx0W1wibGFzdF9jaGFuZ2VfaWRcIl0gPSBzZXNzaW9uLmZpbGVzWzBdLmxhc3RfbW9kaWZpZWQudG9TdHJpbmcoKTtcbiAgICAgICAgcmVzdWx0W1wibGFzdF9jaGFuZ2VfdGltZXN0YW1wXCJdID0gc2Vzc2lvbi5maWxlc1swXS5sYXN0X21vZGlmaWVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5pZCA9IHNlc3Npb24uaWQ7XG4gICAgICAgIHJlc3VsdC5tb2R1bGVzID0gSlNPTi5wYXJzZShzZXNzaW9uLm1vZHVsZXMpO1xuICAgICAgICByZXN1bHQuZmlsZXMgPSBzZXNzaW9uLmZpbGVzO1xuICAgICAgICByZXN1bHQubGFzdF9tb2RpZmllZCA9IHNlc3Npb24ubGFzdF9tb2RpZmllZDtcbiAgICAgICAgcmVzdWx0LmV4cGlyZXNfYXQgPSBzZXNzaW9uLmV4cGlyZXNfYXQ7XG4gICAgfVxuICAgIHJlcy5qc29uKHJlc3VsdCk7XG5cbn07XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTZXNzaW9uVXBkYXRlOiBDb250cm9sbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgaWQgPSByZXEucGFyYW1zLnNlc3Npb25JZCBhcyBzdHJpbmc7XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uPy5zdWJzdHJpbmcoXCJCZWFyZXIgXCIubGVuZ3RoKTtcblxuICAgIC8vIENoZWNrIGlmIGFjY2VzcyB0b2tlbiBpcyBwcmVzZW50IGluIGNvb2tpZXNcbiAgICBpZiAodHlwZW9mIGFjY2Vzc1Rva2VuICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgYWNjZXNzIHRva2VuIGlzIHZhbGlkXG4gICAgY29uc3QgY2xhaW1zID0gdmVyaWZ5VG9rZW48Snd0RWRpdG9yU2Vzc2lvbkNsYWltcz4oYWNjZXNzVG9rZW4pO1xuICAgIGlmIChjbGFpbXMgPT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgY2xhaW1zIGFyZSB2YWxpZFxuICAgIGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGlmICh0aW1lID49IGNsYWltcy5leHBpcmVzX2F0IHx8IGNsYWltcy5pZCAhPT0gaWQpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDMpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2Vzc2lvbiA9IChhd2FpdCBnZXRfc2Vzc2lvbihpZCkpIGFzIERhdGFiYXNlU2Vzc2lvbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgaWYgKHNlc3Npb24gPT09IHVuZGVmaW5lZCB8fCBzZXNzaW9uID09PSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDA0KS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSB0b2tlbnMgbWF0Y2hcbiAgICBpZiAoc2Vzc2lvbi5hY2Nlc3NfdG9rZW4gIT09IGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAzKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCBwbHVnaW5fdmVyc2lvbiA9IFZlcnNpb24uZnJvbShzZXNzaW9uLnBsdWdpbl92ZXJzaW9uKTtcblxuICAgIGNvbnN0IHsgZmlsZXMgfSA9IHJlcS5ib2R5O1xuICAgIGlmICghQXJyYXkuaXNBcnJheShmaWxlcykpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdE1vZGlmaWVkID0gRGF0ZS5ub3coKTtcbiAgICBzZXNzaW9uLmxhc3RfbW9kaWZpZWQgPSBsYXN0TW9kaWZpZWQ7XG5cbiAgICAvLyBDaGVjayBpZiBmaWxlcyBhcmUgdmFsaWRcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmaWxlLmNvbnRlbnQgIT09ICdzdHJpbmcnIHx8IGZpbGUuY29udGVudC5sZW5ndGggPiAyMDQ4KSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZXNzaW9uRmlsZSA9IHNlc3Npb24uZmlsZXMuZmluZChmID0+IGYuaWQgPT09IGZpbGUuaWQpO1xuICAgICAgICBpZiAoc2Vzc2lvbkZpbGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDApLmVuZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2Vzc2lvbkZpbGUuY29udGVudCA9IGZpbGUuY29udGVudDtcbiAgICAgICAgc2Vzc2lvbkZpbGUubGFzdF9tb2RpZmllZCA9IGxhc3RNb2RpZmllZDtcbiAgICAgICAgYXdhaXQgdXBkYXRlX3Nlc3Npb25fZmlsZShzZXNzaW9uRmlsZSk7XG4gICAgfVxuXG4gICAgYXdhaXQgdXBkYXRlX3Nlc3Npb24oc2Vzc2lvbik7XG4gICAgcmVzLnN0YXR1cygyMDApLmVuZCgpO1xufTsiLCJpbXBvcnQgeyB2NyBhcyB1dWlkIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBjcmVhdGVUb2tlbiB9IGZyb20gJy4vdXRpbHMvand0JztcbmltcG9ydCB7IEp3dEVkaXRvclNlc3Npb25DbGFpbXMgfSBmcm9tICcuL3R5cGVzL2p3dC1jbGFpbXMtdHlwZXMnO1xuaW1wb3J0IERhdGFiYXNlIGZyb20gJ2JldHRlci1zcWxpdGUzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBEYXRhYmFzZVNlc3Npb24sIERhdGFiYXNlU2Vzc2lvbkZpbGUgfSBmcm9tICcuL3V0aWxzL2RibW9kZWxzJztcblxuIWZzLmV4aXN0c1N5bmMoYC4vc3RvcmFnZWApICYmIGZzLm1rZGlyU3luYyhgLi9zdG9yYWdlYCk7XG5jb25zdCBkYXRhRGlyZWN0b3J5ID0gZnMucmVhbHBhdGhTeW5jKCcuL3N0b3JhZ2UnKTtcblxuY29uc3QgZGF0YWJhc2UgPSBEYXRhYmFzZShkYXRhRGlyZWN0b3J5ICsgXCIvc2Vzc2lvbnMuZGJcIiwge1xuICAgIGZpbGVNdXN0RXhpc3Q6IGZhbHNlLFxuICAgIHJlYWRvbmx5OiBmYWxzZVxufSk7XG5kYXRhYmFzZS5wcmFnbWEoXCJqb3VybmFsX21vZGUgPSBXQUxcIik7XG5cbi8vIFNldHVwIHRoZSBkYXRhYmFzZVxuZGF0YWJhc2UuZXhlYyhgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgc2Vzc2lvbnMgKGlkIFBSSU1BUlkgS0VZLCBzZXJ2ZXJfaWQgVEVYVCwgcGx1Z2luX3ZlcnNpb24gVEVYVCwgYWNjZXNzX3Rva2VuIFRFWFQsIG1vZHVsZXMgVEVYVCwgY3JlYXRlZF9hdCBCSUdJTlQsIGV4cGlyZXNfYXQgQklHSU5ULCBsYXN0X21vZGlmaWVkIEJJR0lOVClgKTtcbmRhdGFiYXNlLmV4ZWMoYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHNlc3Npb25zX2NvbnRlbnRzIChpZCBQUklNQVJZIEtFWSwgbmFtZSBWQVJDSEFSKDI0KSwgc2Vzc2lvbl9pZCBURVhULCBjb250ZW50IFRFWFQoMjA0OCksIGxhc3RfbW9kaWZpZWQgQklHSU5UKWApO1xuXG5leHBvcnQgY29uc3QgZ2V0X3Nlc3Npb24gPSBhc3luYyAoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGF0YWJhc2UucHJlcGFyZShcIlNFTEVDVCAqIEZST00gc2Vzc2lvbnMgV0hFUkUgaWQgPSA/IExJTUlUIDFcIikuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBkYXRhYmFzZS5wcmVwYXJlKFwiU0VMRUNUICogRlJPTSBzZXNzaW9uc19jb250ZW50cyBXSEVSRSBzZXNzaW9uX2lkID0gP1wiKS5hbGwoaWQpIHx8IFtdO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgICAgICAgICAgZmlsZXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVfc2Vzc2lvbiA9IGFzeW5jIChzZXJ2ZXJfaWQ6IHN0cmluZywgcGx1Z2luX3ZlcnNpb246IHN0cmluZywgbW9kdWxlczogYW55LCBmaWxlczogRGF0YWJhc2VTZXNzaW9uRmlsZVtdKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgICBjb25zdCBpZCA9IHV1aWQoKTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IDM2MDAgKiAyO1xuICAgIGNvbnN0IGV4cGlyZXNfYXQgPSBEYXRlLm5vdygpICsgZHVyYXRpb24gKiAxMDAwO1xuXG4gICAgY29uc3Qgc2Vzc2lvbjogRGF0YWJhc2VTZXNzaW9uID0ge1xuICAgICAgICBpZCxcbiAgICAgICAgZmlsZXMsXG4gICAgICAgIHNlcnZlcl9pZCxcbiAgICAgICAgcGx1Z2luX3ZlcnNpb24sXG4gICAgICAgIGFjY2Vzc190b2tlbjogY3JlYXRlVG9rZW48Snd0RWRpdG9yU2Vzc2lvbkNsYWltcz4oe1xuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBzZXJ2ZXJfaWQsXG4gICAgICAgICAgICBleHBpcmVzX2F0XG4gICAgICAgIH0sIGR1cmF0aW9uKSxcbiAgICAgICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgICAgICAgZXhwaXJlc19hdCxcbiAgICAgICAgbW9kdWxlczogSlNPTi5zdHJpbmdpZnkobW9kdWxlcyksXG4gICAgICAgIGxhc3RfbW9kaWZpZWQ6IDBcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coc2Vzc2lvbik7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBjb25zdCBzdG10ID0gZGF0YWJhc2UucHJlcGFyZShgSU5TRVJUIElOVE8gc2Vzc2lvbnMgKGlkLCBzZXJ2ZXJfaWQsIHBsdWdpbl92ZXJzaW9uLCBhY2Nlc3NfdG9rZW4sIG1vZHVsZXMsIGNyZWF0ZWRfYXQsIGV4cGlyZXNfYXQsIGxhc3RfbW9kaWZpZWQpIFZBTFVFUyAoPywgPywgPywgPywgPywgPywgPywgPylgKTtcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHN0bXQucnVuKHNlc3Npb24uaWQsIHNlcnZlcl9pZCwgc2Vzc2lvbi5wbHVnaW5fdmVyc2lvbiwgc2Vzc2lvbi5hY2Nlc3NfdG9rZW4sIHNlc3Npb24ubW9kdWxlcywgc2Vzc2lvbi5jcmVhdGVkX2F0LCBzZXNzaW9uLmV4cGlyZXNfYXQsIDApO1xuXG4gICAgICAgIGNvbnN0IHN0bXRGaWxlcyA9IGRhdGFiYXNlLnByZXBhcmUoYElOU0VSVCBJTlRPIHNlc3Npb25zX2NvbnRlbnRzIChpZCwgbmFtZSwgc2Vzc2lvbl9pZCwgY29udGVudCwgbGFzdF9tb2RpZmllZCkgVkFMVUVTICg/LCA/LCA/LCA/LCA/KWApO1xuICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgc3RtdEZpbGVzLnJ1bihmaWxlLmlkLCBmaWxlLm5hbWUsIHNlc3Npb24uaWQsIGZpbGUuY29udGVudCwgZmlsZS5sYXN0X21vZGlmaWVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdHMuY2hhbmdlcyAhPT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShzZXNzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlaigpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVfc2Vzc2lvbl9maWxlID0gYXN5bmMgKGZpbGU6IERhdGFiYXNlU2Vzc2lvbkZpbGUpOiBQcm9taXNlPERhdGFiYXNlU2Vzc2lvbkZpbGU+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBjb25zdCBxdWVyeSA9IGRhdGFiYXNlLnByZXBhcmUoYHVwZGF0ZSBzZXNzaW9uc19jb250ZW50cyBzZXQgY29udGVudCA9ID8sIGxhc3RfbW9kaWZpZWQgPSA/IHdoZXJlIGlkID0gP2ApLnJ1bihmaWxlLmNvbnRlbnQsIGZpbGUubGFzdF9tb2RpZmllZCwgZmlsZS5pZCk7XG4gICAgICAgIGlmIChxdWVyeS5jaGFuZ2VzICE9PSAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKGZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZV9zZXNzaW9uID0gYXN5bmMgKHNlc3Npb246IERhdGFiYXNlU2Vzc2lvbik6IFByb21pc2U8RGF0YWJhc2VTZXNzaW9uPiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBkYXRhYmFzZS5wcmVwYXJlKGB1cGRhdGUgc2Vzc2lvbnMgc2V0IGxhc3RfbW9kaWZpZWQgPSA/IHdoZXJlIGlkID0gP2ApLnJ1bihzZXNzaW9uLmxhc3RfbW9kaWZpZWQsIHNlc3Npb24uaWQpO1xuICAgICAgICBpZiAocXVlcnkuY2hhbmdlcyAhPT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShzZXNzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlaigpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWxldGVfZXhwaXJlZF9zZXNzaW9ucyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgZGF0YWJhc2UucHJlcGFyZShgREVMRVRFIEZST00gc2Vzc2lvbnNfY29udGVudHMgV0hFUkUgZXhwaXJlc19hdCA8ID9gKS5ydW4odGltZSk7XG4gICAgICAgIGRhdGFiYXNlLnByZXBhcmUoYERFTEVURSBGUk9NIHNlc3Npb25zIFdIRVJFIGV4cGlyZXNfYXQgPCA/YCkucnVuKHRpbWUpO1xuXG4gICAgICAgIHJlc29sdmUoKTtcbiAgICB9KTtcbn0iLCJpbXBvcnQgeyBEYXRhYmFzZVNlc3Npb25GaWxlIH0gZnJvbSBcIi4vdXRpbHMvZGJtb2RlbHNcIjtcblxuaW50ZXJmYWNlIFNlc3Npb25EVE8ge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgbW9kdWxlczogUmVjb3JkPHN0cmluZywgTW9kdWxlRFRPPixcbiAgICBmaWxlczogRGF0YWJhc2VTZXNzaW9uRmlsZVtdLFxuICAgIGxhc3RfbW9kaWZpZWQ6IG51bWJlcixcbiAgICBleHBpcmVzX2F0OiBudW1iZXIsXG59O1xuXG5pbnRlcmZhY2UgTW9kdWxlRFRPIHtcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgZnVuY3Rpb25zOiBGdW5jdGlvbkRUT1tdLFxufVxuXG5pbnRlcmZhY2UgRnVuY3Rpb25EVE8ge1xuICAgIG1vZHVsZTogc3RyaW5nIHwgbnVsbCxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgcmV0dXJuX3R5cGU6IHN0cmluZyxcbiAgICBwYXJhbWV0ZXJfdHlwZXM6IHN0cmluZ1tdLFxuICAgIGNvbXBsZXRpb246IHN0cmluZyxcbn1cblxuY29uc3QgZGVtb0NvZGUgPSBgXG5pbXBvcnQgYm90O1xuXG5pbnQgbWFpbigpIHtcbiAgIGJvdC5jaGF0KFwiSGVsbG8gV29ybGQhXCIpO1xuICAgcmV0dXJuIDA7XG59XG5gLnRyaW0oKTtcblxuZXhwb3J0IGNvbnN0IGRlbW9TZXNzaW9uOiBTZXNzaW9uRFRPID0ge1xuICAgIGlkOiBcImRlbW9cIixcbiAgICBtb2R1bGVzOiB7XG4gICAgICAgIGJvdDoge1xuICAgICAgICAgICAgbmFtZTogXCJib3RcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uczogW1xuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcImNoYXRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwiY2hhdCgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiZGVwb3NpdF9pdGVtXCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJzdHJpbmdcIiBdLCBjb21wbGV0aW9uOiBcImRlcG9zaXRfaXRlbSgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiZ2V0X2Jsb2NrXCIsIHJldHVybl90eXBlOiBcInN0cmluZ1wiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJzdHJpbmdcIiBdLCBjb21wbGV0aW9uOiBcImdldF9ibG9jaygkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiZ2V0X2RpcmVjdGlvblwiLCByZXR1cm5fdHlwZTogXCJzdHJpbmdcIiwgcGFyYW1ldGVyX3R5cGVzOiBbXSwgY29tcGxldGlvbjogXCJnZXRfZGlyZWN0aW9uKCkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiZ2V0X2l0ZW1cIiwgcmV0dXJuX3R5cGU6IFwic3RyaW5nXCIsIHBhcmFtZXRlcl90eXBlczogW10sIGNvbXBsZXRpb246IFwiZ2V0X2l0ZW0oKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJnZXRfc2VsZWN0ZWRfc2xvdFwiLCByZXR1cm5fdHlwZTogXCJudW1iZXJcIiwgcGFyYW1ldGVyX3R5cGVzOiBbXSwgY29tcGxldGlvbjogXCJnZXRfc2VsZWN0ZWRfc2xvdCgpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcIm1vdmVcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwibW92ZSgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwicHJpbnRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwicHJpbnQoJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcInJvdGF0ZV9sZWZ0XCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFtdLCBjb21wbGV0aW9uOiBcInJvdGF0ZV9sZWZ0KCkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwicm90YXRlX3JpZ2h0XCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFtdLCBjb21wbGV0aW9uOiBcInJvdGF0ZV9yaWdodCgpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcInNlbGVjdF9zbG90XCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJpbnRcIiBdLCBjb21wbGV0aW9uOiBcInNlbGVjdF9zbG90KCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJzZXRfc3RhdHVzXCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJzdHJpbmdcIiwgXCJpbnRcIiBdLCBjb21wbGV0aW9uOiBcInNldF9zdGF0dXMoJDEsICQyKSQwXCIgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgbWF0aDoge1xuICAgICAgICAgICAgbmFtZTogXCJtYXRoXCIsXG4gICAgICAgICAgICBmdW5jdGlvbnM6IFtcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwiY2VpbFwiLCByZXR1cm5fdHlwZTogXCJmbG9hdFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJmbG9hdFwiIF0sIGNvbXBsZXRpb246IFwiY2VpbCgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwibWF0aFwiLCBuYW1lOiBcImNvc1wiLCByZXR1cm5fdHlwZTogXCJmbG9hdFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJmbG9hdFwiIF0sIGNvbXBsZXRpb246IFwiY29zKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwiZmxvb3JcIiwgcmV0dXJuX3R5cGU6IFwiZmxvYXRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwiZmxvYXRcIiBdLCBjb21wbGV0aW9uOiBcImZsb29yKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwicm91bmRcIiwgcmV0dXJuX3R5cGU6IFwiZmxvYXRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwiZmxvYXRcIiBdLCBjb21wbGV0aW9uOiBcInJvdW5kKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwic2luXCIsIHJldHVybl90eXBlOiBcImZsb2F0XCIsIHBhcmFtZXRlcl90eXBlczogWyBcImZsb2F0XCIgXSwgY29tcGxldGlvbjogXCJzaW4oJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcIm1hdGhcIiwgbmFtZTogXCJzcXJ0XCIsIHJldHVybl90eXBlOiBcImZsb2F0XCIsIHBhcmFtZXRlcl90eXBlczogWyBcImZsb2F0XCIgXSwgY29tcGxldGlvbjogXCJzcXJ0KCQxKSQwXCIgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgbGFuZzoge1xuICAgICAgICAgICAgbmFtZTogXCJsYW5nXCIsXG4gICAgICAgICAgICBmdW5jdGlvbnM6IFtcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJzdHJsZW5cIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwic3RybGVuKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJpc19pbnRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwiaXNfaW50KCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJ0b19pbnRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwidG9faW50KCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJpc19mbG9hdFwiLCByZXR1cm5fdHlwZTogXCJpbnRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJpc19mbG9hdCgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IG51bGwsIG5hbWU6IFwidG9fZmxvYXRcIiwgcmV0dXJuX3R5cGU6IFwiZmxvYXRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJ0b19mbG9hdCgkMSkkMFwiIH0sXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGZpbGVzOiBbeyBpZDogXCJtYWluLmNic1wiLCBuYW1lOiBcIm1haW4uY2JzXCIsIGxhc3RfbW9kaWZpZWQ6IERhdGUubm93KCksIGNvbnRlbnQ6IGRlbW9Db2RlIH1dLFxuICAgIGxhc3RfbW9kaWZpZWQ6IDAsXG4gICAgZXhwaXJlc19hdDogMCxcbn07IiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgaGFuZGxlU2VydmVyQ3JlYXRlIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvc2VydmVyLWNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IGhhbmRsZURlbW9TZXNzaW9uR2V0LCBoYW5kbGVTZXNzaW9uQ3JlYXRlLCBoYW5kbGVTZXNzaW9uR2V0LCBoYW5kbGVTZXNzaW9uVXBkYXRlIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvc2Vzc2lvbi1jb250cm9sbGVyXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cFJvdXRlcyhleHByZXNzOiBBcHBsaWNhdGlvbikge1xuXG4gICAgZXhwcmVzcy5wb3N0KFwiL2FwaS9zZXJ2ZXJzXCIsIGhhbmRsZVNlcnZlckNyZWF0ZSk7XG5cbiAgICBleHByZXNzLnBvc3QoXCIvYXBpL3Nlc3Npb25zXCIsIGhhbmRsZVNlc3Npb25DcmVhdGUpO1xuICAgIGV4cHJlc3MuZ2V0KFwiL2FwaS9zZXNzaW9ucy9kZW1vXCIsIGhhbmRsZURlbW9TZXNzaW9uR2V0KTtcbiAgICBleHByZXNzLmdldChcIi9hcGkvc2Vzc2lvbnMvOnNlc3Npb25JZFwiLCBoYW5kbGVTZXNzaW9uR2V0KTtcbiAgICBleHByZXNzLnB1dChcIi9hcGkvc2Vzc2lvbnMvOnNlc3Npb25JZFwiLCBoYW5kbGVTZXNzaW9uVXBkYXRlKTtcblxufSIsImltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRva2VuPFQgZXh0ZW5kcyBvYmplY3Q+KHBheWxvYWQ6IFQsIHRpbWVWYWxpZDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGp3dC5zaWduKHBheWxvYWQsIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgYXMgc3RyaW5nLCB7XG4gICAgICAgIGV4cGlyZXNJbjogRGF0ZS5ub3coKSArIHRpbWVWYWxpZFxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5VG9rZW48VCBleHRlbmRzIG9iamVjdD4odG9rZW46IHN0cmluZyk6IFQgfCBudWxsIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gand0LnZlcmlmeSh0b2tlbiwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCBhcyBzdHJpbmcpIGFzIFQ7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVmVyc2lvbiB7XG4gICAgXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTFBIQTogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJFVEE6IG51bWJlciA9IDE7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRUxFQVNFOiBudW1iZXIgPSAyNTU7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVkVSU0lPTl9SRUdFWDogUmVnRXhwID0gL15cXGQrKFxcLlxcZCspKlthYl0/JC87XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBJTlZBTElEOiBWZXJzaW9uID0gbmV3IFZlcnNpb24oW10sIFZlcnNpb24uQUxQSEEpO1xuXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBWXzBfNV8xX01VTFRJUExFX0ZJTEVTX0VESVRJTkcgPSBWZXJzaW9uLmZyb20oXCIwLjUuMVwiKTtcbiAgICBcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlZ21lbnRzOiBudW1iZXJbXTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hhbm5lbDogbnVtYmVyO1xuICAgIHB1YmxpYyByZWFkb25seSBzdHJpbmdpZmllZDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihzZWdtZW50czogbnVtYmVyW10sIGNoYW5uZWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLnNlZ21lbnRzID0gc2VnbWVudHM7XG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICAgIHRoaXMuc3RyaW5naWZpZWQgPSBzZWdtZW50cy5qb2luKFwiLlwiKSArIFZlcnNpb24uZ2V0Q2hhbm5lbENoYXIoY2hhbm5lbCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBmcm9tKGlucHV0OiBzdHJpbmcpOiBWZXJzaW9uIHtcbiAgICAgICAgaWYgKCFWZXJzaW9uLlZFUlNJT05fUkVHRVgudGVzdChpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJzaW9uLklOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoYW5uZWw6IG51bWJlcjtcbiAgICAgICAgaWYgKGlucHV0LmVuZHNXaXRoKFwiYVwiKSB8fCBpbnB1dC5lbmRzV2l0aChcImJcIikpIHtcbiAgICAgICAgICAgIGNoYW5uZWwgPSBpbnB1dC5lbmRzV2l0aChcImFcIikgPyBWZXJzaW9uLkFMUEhBIDogVmVyc2lvbi5CRVRBO1xuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zbGljZSgwLCAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGFubmVsID0gVmVyc2lvbi5SRUxFQVNFO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmF3U2VnbWVudHMgPSBpbnB1dC5pbmNsdWRlcyhcIi5cIikgPyBpbnB1dC5zcGxpdChcIi5cIikgOiBbaW5wdXRdO1xuICAgICAgICBjb25zdCBzZWdtZW50cyA9IHJhd1NlZ21lbnRzLm1hcChWZXJzaW9uLnRvU2VnbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWZXJzaW9uKHNlZ21lbnRzLCBjaGFubmVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyB0b1NlZ21lbnQoaW5wdXQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChpbnB1dCwgMTApO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcyAhPT0gVmVyc2lvbi5JTlZBTElEO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc09sZGVyVGhhbih2ZXJzaW9uOiBWZXJzaW9uKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmUodmVyc2lvbikgPCAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc05ld2VyVGhhbih2ZXJzaW9uOiBWZXJzaW9uKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmUodmVyc2lvbikgPiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29tcGFyZSh2ZXJzaW9uOiBWZXJzaW9uKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMgPT09IFZlcnNpb24uSU5WQUxJRCkgcmV0dXJuIC0xO1xuICAgICAgICBpZiAodmVyc2lvbiA9PT0gVmVyc2lvbi5JTlZBTElEKSByZXR1cm4gMTtcblxuICAgICAgICBjb25zdCBtaW5MZW5ndGggPSBNYXRoLm1pbih0aGlzLnNlZ21lbnRzLmxlbmd0aCwgdmVyc2lvbi5zZWdtZW50cy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWdtZW50c1tpXSA8IHZlcnNpb24uc2VnbWVudHNbaV0pIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlZ21lbnRzW2ldID4gdmVyc2lvbi5zZWdtZW50c1tpXSkgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZWdtZW50cy5sZW5ndGggPT09IHZlcnNpb24uc2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gVmVyc2lvbi5jb21wYXJlQ2hhbm5lbCh0aGlzLmNoYW5uZWwsIHZlcnNpb24uY2hhbm5lbCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBncmVhdGVyU2VnbWVudCA9IHRoaXMuc2VnbWVudHMubGVuZ3RoID09PSBtaW5MZW5ndGggPyB2ZXJzaW9uLnNlZ21lbnRzIDogdGhpcy5zZWdtZW50cztcbiAgICAgICAgZm9yIChsZXQgaSA9IG1pbkxlbmd0aDsgaSA8IGdyZWF0ZXJTZWdtZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZ3JlYXRlclNlZ21lbnRbaV0gIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ3JlYXRlclNlZ21lbnQgPT09IHRoaXMuc2VnbWVudHMgPyAxIDogLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gVmVyc2lvbi5jb21wYXJlQ2hhbm5lbCh0aGlzLmNoYW5uZWwsIHZlcnNpb24uY2hhbm5lbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29tcGFyZUNoYW5uZWwoY2gxOiBudW1iZXIsIGNoMjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGNoMSAtIGNoMjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRDaGFubmVsQ2hhcihjaGFubmVsOiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICAgICAgICAgIGNhc2UgVmVyc2lvbi5BTFBIQTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJhXCI7XG4gICAgICAgICAgICBjYXNlIFZlcnNpb24uQkVUQTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJiXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJldHRlci1zcWxpdGUzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvb2tpZS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9