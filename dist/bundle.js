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
    author: "Demo",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRWxELHNDQUE4QixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7Ozs7Ozs7O0FDUmxGLDJDOzs7Ozs7Ozs7O0FDQUEsMEM7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7O0FDQUEseUM7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFNUJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvLi9zcmMvY29udHJvbGxlcnMvc2VydmVyLWNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kLy4vc3JjL2NvbnRyb2xsZXJzL3Nlc3Npb24tY29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvLi9zcmMvZGF0YWJhc2UudHMiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kLy4vc3JjL2RlbW8udHMiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kLy4vc3JjL3JvdXRlcy50cyIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvLi9zcmMvdXRpbHMvand0LnRzIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC8uL3NyYy91dGlscy92ZXJzaW9ucy50cyIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJiZXR0ZXItc3FsaXRlM1wiIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImNvb2tpZS1wYXJzZXJcIiIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJkb3RlbnZcIiIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwianNvbndlYnRva2VuXCIiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwidXVpZFwiIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IHNldHVwUm91dGVzIH0gZnJvbSBcIi4vcm91dGVzXCI7XG5pbXBvcnQgeyBjb25maWdEb3RlbnYgfSBmcm9tIFwiZG90ZW52XCI7XG5pbXBvcnQgY29va2llUGFyc2VyIGZyb20gXCJjb29raWUtcGFyc2VyXCI7XG5cbmNvbmZpZ0RvdGVudigpO1xuXG5jb25zdCBhcHAgPSBleHByZXNzLmRlZmF1bHQoKTtcbmFwcC51c2UoY29va2llUGFyc2VyKCkpO1xuYXBwLnVzZShleHByZXNzLmpzb24oKSk7XG5cbnNldHVwUm91dGVzKGFwcCk7XG5cbmFwcC5saXN0ZW4ocHJvY2Vzcy5lbnYuUE9SVCk7IiwiaW1wb3J0IHsgY3JlYXRlVG9rZW4gfSBmcm9tIFwiLi4vdXRpbHMvand0XCI7XG5pbXBvcnQgeyB2NyBhcyB1dWlkIH0gZnJvbSBcInV1aWRcIjtcbmltcG9ydCB7IEp3dFNlcnZlckNsYWltcyB9IGZyb20gXCIuLi90eXBlcy9qd3QtY2xhaW1zLXR5cGVzXCI7XG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSBcIi4uL3R5cGVzL2NvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZVNlcnZlckNyZWF0ZTogQ29udHJvbGxlciA9IChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IHZlcnNpb24gPSByZXEuYm9keS52ZXJzaW9uO1xuICAgIGlmICh0eXBlb2YgdmVyc2lvbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVzLnN0YXR1cygyMDApLnNlbmQoXG4gICAgICAgIGNyZWF0ZVRva2VuPEp3dFNlcnZlckNsYWltcz4oe1xuICAgICAgICAgICAgaWQ6IHV1aWQoKSxcbiAgICAgICAgICAgIHZlcnNpb24sXG4gICAgICAgIH0sIDMgKiA2MCAqIDYwKVxuICAgICk7XG59IiwiaW1wb3J0IHsgY3JlYXRlX3Nlc3Npb24sIGdldF9zZXNzaW9uLCB1cGRhdGVfc2Vzc2lvbiwgdXBkYXRlX3Nlc3Npb25fZmlsZSB9IGZyb20gXCIuLi9kYXRhYmFzZVwiO1xuaW1wb3J0IHsgZGVtb1Nlc3Npb24gfSBmcm9tIFwiLi4vZGVtb1wiO1xuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi90eXBlcy9jb250cm9sbGVyXCJcbmltcG9ydCB7IEp3dEVkaXRvclNlc3Npb25DbGFpbXMsIEp3dFNlcnZlckNsYWltcyB9IGZyb20gXCIuLi90eXBlcy9qd3QtY2xhaW1zLXR5cGVzXCI7XG5pbXBvcnQgeyBEYXRhYmFzZVNlc3Npb24sIERhdGFiYXNlU2Vzc2lvbkZpbGUgfSBmcm9tIFwiLi4vdXRpbHMvZGJtb2RlbHNcIjtcbmltcG9ydCB7IHZlcmlmeVRva2VuIH0gZnJvbSBcIi4uL3V0aWxzL2p3dFwiO1xuaW1wb3J0IHsgVmVyc2lvbiB9IGZyb20gXCIuLi91dGlscy92ZXJzaW9uc1wiO1xuaW1wb3J0IHsgdjcgYXMgdXVpZCB9IGZyb20gXCJ1dWlkXCI7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTZXNzaW9uQ3JlYXRlOiBDb250cm9sbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgYXV0aG9yaXphdGlvbiA9IHJlcS5oZWFkZXJzW1wiYXV0aG9yaXphdGlvblwiXTtcbiAgICBpZiAoYXV0aG9yaXphdGlvbiA9PT0gdW5kZWZpbmVkIHx8ICFhdXRob3JpemF0aW9uPy5zdGFydHNXaXRoKFwiQmVhcmVyIFwiKSkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IGF1dGhvcml6YXRpb24uc3Vic3RyaW5nKFwiQmVhcmVyIFwiLmxlbmd0aCk7XG4gICAgY29uc3QgY2xhaW1zID0gdmVyaWZ5VG9rZW48Snd0U2VydmVyQ2xhaW1zPih0b2tlbik7XG5cbiAgICBpZiAoY2xhaW1zID09PSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgaWQsIHZlcnNpb246IHJhd1ZlcnNpb24gfSA9IGNsYWltcztcbiAgICBjb25zdCB2ZXJzaW9uID0gVmVyc2lvbi5mcm9tKHJhd1ZlcnNpb24pO1xuXG4gICAgY29uc3Qgc2Vzc2lvbkZpbGVzOiBEYXRhYmFzZVNlc3Npb25GaWxlW10gPSBbXTtcbiAgICBpZiAodmVyc2lvbi5pc09sZGVyVGhhbihWZXJzaW9uLlZfMF81XzFfTVVMVElQTEVfRklMRVNfRURJVElORykpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHJlcS5ib2R5LmZpbGU7XG4gICAgICAgIGlmICh0eXBlb2YgY29udGVudCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlc3Npb25GaWxlcy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiB1dWlkKCksXG4gICAgICAgICAgICBuYW1lOiBcInByb2dyYW0uY2JmXCIsXG4gICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgbGFzdF9jaGFuZ2VfaWQ6IFwiXCIsXG4gICAgICAgICAgICBsYXN0X2NoYW5nZV90aW1lc3RhbXA6IDBcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSByZXEuYm9keS5maWxlcyBhcyBEYXRhYmFzZVNlc3Npb25GaWxlW107XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShmaWxlcykpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgc2Vzc2lvbkZpbGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiB1dWlkKCksXG4gICAgICAgICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGZpbGUuY29udGVudCxcbiAgICAgICAgICAgICAgICBsYXN0X21vZGlmaWVkOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlcy5qc29uKHtcbiAgICAgICAgLi4uKGF3YWl0IGNyZWF0ZV9zZXNzaW9uKGlkIGFzIHN0cmluZywgcmF3VmVyc2lvbiwgcmVxLmJvZHkubW9kdWxlcywgc2Vzc2lvbkZpbGVzKSlcbiAgICB9KVxufTtcblxuXG5leHBvcnQgY29uc3QgaGFuZGxlRGVtb1Nlc3Npb25HZXQ6IENvbnRyb2xsZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XG4gICAgICAgIC4uLmRlbW9TZXNzaW9uLFxuICAgICAgICBsYXN0X21vZGlmaWVkOiBEYXRlLm5vdygpLFxuICAgICAgICBleHBpcmVzX2F0OiBEYXRlLm5vdygpICsgMyAqIDYwICogNjAgKiAxMDAwLFxuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZVNlc3Npb25HZXQ6IENvbnRyb2xsZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBpZCA9IHJlcS5wYXJhbXMuc2Vzc2lvbklkIGFzIHN0cmluZztcbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24/LnN1YnN0cmluZyhcIkJlYXJlciBcIi5sZW5ndGgpO1xuXG4gICAgLy8gQ2hlY2sgaWYgYWNjZXNzIHRva2VuIGlzIHByZXNlbnQgaW4gY29va2llc1xuICAgIGlmICh0eXBlb2YgYWNjZXNzVG9rZW4gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgdmFsaWRcbiAgICBjb25zdCBjbGFpbXMgPSB2ZXJpZnlUb2tlbjxKd3RFZGl0b3JTZXNzaW9uQ2xhaW1zPihhY2Nlc3NUb2tlbik7XG4gICAgaWYgKGNsYWltcyA9PSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSBjbGFpbXMgYXJlIHZhbGlkXG4gICAgY29uc3QgdGltZSA9IERhdGUubm93KCk7XG4gICAgaWYgKHRpbWUgPj0gY2xhaW1zLmV4cGlyZXNfYXQgfHwgY2xhaW1zLmlkICE9PSBpZCkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMykuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZXNzaW9uID0gKGF3YWl0IGdldF9zZXNzaW9uKGlkKSkgYXMgRGF0YWJhc2VTZXNzaW9uIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICBpZiAoc2Vzc2lvbiA9PT0gdW5kZWZpbmVkIHx8IHNlc3Npb24gPT09IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDQpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIHRva2VucyBtYXRjaFxuICAgIGlmIChzZXNzaW9uLmFjY2Vzc190b2tlbiAhPT0gYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDMpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHBsdWdpbl92ZXJzaW9uID0gVmVyc2lvbi5mcm9tKHNlc3Npb24ucGx1Z2luX3ZlcnNpb24pO1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGNoYW5nZXMgaWYgXCJsYXN0X2NoYW5nZV9pZFwiIGlzIHByZXNlbnRcbiAgICBpZiAocmVxLnF1ZXJ5Lmxhc3RfbW9kaWZpZWQgJiYgc2Vzc2lvbi5sYXN0X21vZGlmaWVkID09PSBwYXJzZUludChyZXEucXVlcnkubGFzdF9tb2RpZmllZCBhcyBzdHJpbmcpKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoMzA0KS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogYW55ID0ge307XG4gICAgaWYgKHBsdWdpbl92ZXJzaW9uLmlzT2xkZXJUaGFuKFZlcnNpb24uVl8wXzVfMV9NVUxUSVBMRV9GSUxFU19FRElUSU5HKSkge1xuICAgICAgICByZXN1bHRbXCJjb250ZW50XCJdID0gc2Vzc2lvbi5maWxlc1swXS5jb250ZW50O1xuICAgICAgICByZXN1bHRbXCJsYXN0X2NoYW5nZV9pZFwiXSA9IHNlc3Npb24uZmlsZXNbMF0ubGFzdF9tb2RpZmllZC50b1N0cmluZygpO1xuICAgICAgICByZXN1bHRbXCJsYXN0X2NoYW5nZV90aW1lc3RhbXBcIl0gPSBzZXNzaW9uLmZpbGVzWzBdLmxhc3RfbW9kaWZpZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0LmlkID0gc2Vzc2lvbi5pZDtcbiAgICAgICAgcmVzdWx0Lm1vZHVsZXMgPSBKU09OLnBhcnNlKHNlc3Npb24ubW9kdWxlcyk7XG4gICAgICAgIHJlc3VsdC5maWxlcyA9IHNlc3Npb24uZmlsZXM7XG4gICAgICAgIHJlc3VsdC5sYXN0X21vZGlmaWVkID0gc2Vzc2lvbi5sYXN0X21vZGlmaWVkO1xuICAgICAgICByZXN1bHQuZXhwaXJlc19hdCA9IHNlc3Npb24uZXhwaXJlc19hdDtcbiAgICB9XG4gICAgcmVzLmpzb24ocmVzdWx0KTtcblxufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZVNlc3Npb25VcGRhdGU6IENvbnRyb2xsZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICBjb25zdCBpZCA9IHJlcS5wYXJhbXMuc2Vzc2lvbklkIGFzIHN0cmluZztcbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24/LnN1YnN0cmluZyhcIkJlYXJlciBcIi5sZW5ndGgpO1xuXG4gICAgLy8gQ2hlY2sgaWYgYWNjZXNzIHRva2VuIGlzIHByZXNlbnQgaW4gY29va2llc1xuICAgIGlmICh0eXBlb2YgYWNjZXNzVG9rZW4gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSBhY2Nlc3MgdG9rZW4gaXMgdmFsaWRcbiAgICBjb25zdCBjbGFpbXMgPSB2ZXJpZnlUb2tlbjxKd3RFZGl0b3JTZXNzaW9uQ2xhaW1zPihhY2Nlc3NUb2tlbik7XG4gICAgaWYgKGNsYWltcyA9PSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSBjbGFpbXMgYXJlIHZhbGlkXG4gICAgY29uc3QgdGltZSA9IERhdGUubm93KCk7XG4gICAgaWYgKHRpbWUgPj0gY2xhaW1zLmV4cGlyZXNfYXQgfHwgY2xhaW1zLmlkICE9PSBpZCkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMykuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZXNzaW9uID0gKGF3YWl0IGdldF9zZXNzaW9uKGlkKSkgYXMgRGF0YWJhc2VTZXNzaW9uIHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgICBpZiAoc2Vzc2lvbiA9PT0gdW5kZWZpbmVkIHx8IHNlc3Npb24gPT09IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDQpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIHRva2VucyBtYXRjaFxuICAgIGlmIChzZXNzaW9uLmFjY2Vzc190b2tlbiAhPT0gYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDMpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHBsdWdpbl92ZXJzaW9uID0gVmVyc2lvbi5mcm9tKHNlc3Npb24ucGx1Z2luX3ZlcnNpb24pO1xuXG4gICAgY29uc3QgeyBmaWxlcyB9ID0gcmVxLmJvZHk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGZpbGVzKSkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMCkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0TW9kaWZpZWQgPSBEYXRlLm5vdygpO1xuICAgIHNlc3Npb24ubGFzdF9tb2RpZmllZCA9IGxhc3RNb2RpZmllZDtcblxuICAgIC8vIENoZWNrIGlmIGZpbGVzIGFyZSB2YWxpZFxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICBpZiAodHlwZW9mIGZpbGUuY29udGVudCAhPT0gJ3N0cmluZycgfHwgZmlsZS5jb250ZW50Lmxlbmd0aCA+IDIwNDgpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlc3Npb25GaWxlID0gc2Vzc2lvbi5maWxlcy5maW5kKGYgPT4gZi5pZCA9PT0gZmlsZS5pZCk7XG4gICAgICAgIGlmIChzZXNzaW9uRmlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXNzaW9uRmlsZS5jb250ZW50ID0gZmlsZS5jb250ZW50O1xuICAgICAgICBzZXNzaW9uRmlsZS5sYXN0X21vZGlmaWVkID0gbGFzdE1vZGlmaWVkO1xuICAgICAgICBhd2FpdCB1cGRhdGVfc2Vzc2lvbl9maWxlKHNlc3Npb25GaWxlKTtcbiAgICB9XG5cbiAgICBhd2FpdCB1cGRhdGVfc2Vzc2lvbihzZXNzaW9uKTtcbiAgICByZXMuc3RhdHVzKDIwMCkuZW5kKCk7XG59OyIsImltcG9ydCB7IHY3IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IGNyZWF0ZVRva2VuIH0gZnJvbSAnLi91dGlscy9qd3QnO1xuaW1wb3J0IHsgSnd0RWRpdG9yU2Vzc2lvbkNsYWltcyB9IGZyb20gJy4vdHlwZXMvand0LWNsYWltcy10eXBlcyc7XG5pbXBvcnQgRGF0YWJhc2UgZnJvbSAnYmV0dGVyLXNxbGl0ZTMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IERhdGFiYXNlU2Vzc2lvbiwgRGF0YWJhc2VTZXNzaW9uRmlsZSB9IGZyb20gJy4vdXRpbHMvZGJtb2RlbHMnO1xuXG4hZnMuZXhpc3RzU3luYyhgLi9zdG9yYWdlYCkgJiYgZnMubWtkaXJTeW5jKGAuL3N0b3JhZ2VgKTtcbmNvbnN0IGRhdGFEaXJlY3RvcnkgPSBmcy5yZWFscGF0aFN5bmMoJy4vc3RvcmFnZScpO1xuXG5jb25zdCBkYXRhYmFzZSA9IERhdGFiYXNlKGRhdGFEaXJlY3RvcnkgKyBcIi9zZXNzaW9ucy5kYlwiLCB7XG4gICAgZmlsZU11c3RFeGlzdDogZmFsc2UsXG4gICAgcmVhZG9ubHk6IGZhbHNlXG59KTtcbmRhdGFiYXNlLnByYWdtYShcImpvdXJuYWxfbW9kZSA9IFdBTFwiKTtcblxuLy8gU2V0dXAgdGhlIGRhdGFiYXNlXG5kYXRhYmFzZS5leGVjKGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBzZXNzaW9ucyAoaWQgUFJJTUFSWSBLRVksIHNlcnZlcl9pZCBURVhULCBwbHVnaW5fdmVyc2lvbiBURVhULCBhY2Nlc3NfdG9rZW4gVEVYVCwgbW9kdWxlcyBURVhULCBjcmVhdGVkX2F0IEJJR0lOVCwgZXhwaXJlc19hdCBCSUdJTlQsIGxhc3RfbW9kaWZpZWQgQklHSU5UKWApO1xuZGF0YWJhc2UuZXhlYyhgQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgc2Vzc2lvbnNfY29udGVudHMgKGlkIFBSSU1BUlkgS0VZLCBuYW1lIFZBUkNIQVIoMjQpLCBzZXNzaW9uX2lkIFRFWFQsIGNvbnRlbnQgVEVYVCgyMDQ4KSwgbGFzdF9tb2RpZmllZCBCSUdJTlQpYCk7XG5cbmV4cG9ydCBjb25zdCBnZXRfc2Vzc2lvbiA9IGFzeW5jIChpZDogc3RyaW5nKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBkYXRhYmFzZS5wcmVwYXJlKFwiU0VMRUNUICogRlJPTSBzZXNzaW9ucyBXSEVSRSBpZCA9ID8gTElNSVQgMVwiKS5nZXQoaWQpO1xuICAgICAgICBjb25zdCBmaWxlcyA9IGRhdGFiYXNlLnByZXBhcmUoXCJTRUxFQ1QgKiBGUk9NIHNlc3Npb25zX2NvbnRlbnRzIFdIRVJFIHNlc3Npb25faWQgPSA/XCIpLmFsbChpZCkgfHwgW107XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICAgICAgICBmaWxlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGNyZWF0ZV9zZXNzaW9uID0gYXN5bmMgKHNlcnZlcl9pZDogc3RyaW5nLCBwbHVnaW5fdmVyc2lvbjogc3RyaW5nLCBtb2R1bGVzOiBhbnksIGZpbGVzOiBEYXRhYmFzZVNlc3Npb25GaWxlW10pOiBQcm9taXNlPGFueT4gPT4ge1xuICAgIGNvbnN0IGlkID0gdXVpZCgpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gMzYwMCAqIDI7XG4gICAgY29uc3QgZXhwaXJlc19hdCA9IERhdGUubm93KCkgKyBkdXJhdGlvbiAqIDEwMDA7XG5cbiAgICBjb25zdCBzZXNzaW9uOiBEYXRhYmFzZVNlc3Npb24gPSB7XG4gICAgICAgIGlkLFxuICAgICAgICBmaWxlcyxcbiAgICAgICAgc2VydmVyX2lkLFxuICAgICAgICBwbHVnaW5fdmVyc2lvbixcbiAgICAgICAgYWNjZXNzX3Rva2VuOiBjcmVhdGVUb2tlbjxKd3RFZGl0b3JTZXNzaW9uQ2xhaW1zPih7XG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICAgIHNlcnZlcl9pZCxcbiAgICAgICAgICAgIGV4cGlyZXNfYXRcbiAgICAgICAgfSwgZHVyYXRpb24pLFxuICAgICAgICBjcmVhdGVkX2F0OiBEYXRlLm5vdygpLFxuICAgICAgICBleHBpcmVzX2F0LFxuICAgICAgICBtb2R1bGVzOiBKU09OLnN0cmluZ2lmeShtb2R1bGVzKSxcbiAgICAgICAgbGFzdF9tb2RpZmllZDogMFxuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZyhzZXNzaW9uKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0bXQgPSBkYXRhYmFzZS5wcmVwYXJlKGBJTlNFUlQgSU5UTyBzZXNzaW9ucyAoaWQsIHNlcnZlcl9pZCwgcGx1Z2luX3ZlcnNpb24sIGFjY2Vzc190b2tlbiwgbW9kdWxlcywgY3JlYXRlZF9hdCwgZXhwaXJlc19hdCwgbGFzdF9tb2RpZmllZCkgVkFMVUVTICg/LCA/LCA/LCA/LCA/LCA/LCA/LCA/KWApO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gc3RtdC5ydW4oc2Vzc2lvbi5pZCwgc2VydmVyX2lkLCBzZXNzaW9uLnBsdWdpbl92ZXJzaW9uLCBzZXNzaW9uLmFjY2Vzc190b2tlbiwgc2Vzc2lvbi5tb2R1bGVzLCBzZXNzaW9uLmNyZWF0ZWRfYXQsIHNlc3Npb24uZXhwaXJlc19hdCwgMCk7XG5cbiAgICAgICAgY29uc3Qgc3RtdEZpbGVzID0gZGF0YWJhc2UucHJlcGFyZShgSU5TRVJUIElOVE8gc2Vzc2lvbnNfY29udGVudHMgKGlkLCBuYW1lLCBzZXNzaW9uX2lkLCBjb250ZW50LCBsYXN0X21vZGlmaWVkKSBWQUxVRVMgKD8sID8sID8sID8sID8pYCk7XG4gICAgICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgICAgICBzdG10RmlsZXMucnVuKGZpbGUuaWQsIGZpbGUubmFtZSwgc2Vzc2lvbi5pZCwgZmlsZS5jb250ZW50LCBmaWxlLmxhc3RfbW9kaWZpZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAocmVzdWx0cy5jaGFuZ2VzICE9PSAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHNlc3Npb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZV9zZXNzaW9uX2ZpbGUgPSBhc3luYyAoZmlsZTogRGF0YWJhc2VTZXNzaW9uRmlsZSk6IFByb21pc2U8RGF0YWJhc2VTZXNzaW9uRmlsZT4gPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gZGF0YWJhc2UucHJlcGFyZShgdXBkYXRlIHNlc3Npb25zX2NvbnRlbnRzIHNldCBjb250ZW50ID0gPywgbGFzdF9tb2RpZmllZCA9ID8gd2hlcmUgaWQgPSA/YCkucnVuKGZpbGUuY29udGVudCwgZmlsZS5sYXN0X21vZGlmaWVkLCBmaWxlLmlkKTtcbiAgICAgICAgaWYgKHF1ZXJ5LmNoYW5nZXMgIT09IDApIHtcbiAgICAgICAgICAgIHJlc29sdmUoZmlsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWooKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlX3Nlc3Npb24gPSBhc3luYyAoc2Vzc2lvbjogRGF0YWJhc2VTZXNzaW9uKTogUHJvbWlzZTxEYXRhYmFzZVNlc3Npb24+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBjb25zdCBxdWVyeSA9IGRhdGFiYXNlLnByZXBhcmUoYHVwZGF0ZSBzZXNzaW9ucyBzZXQgbGFzdF9tb2RpZmllZCA9ID8gd2hlcmUgaWQgPSA/YCkucnVuKHNlc3Npb24ubGFzdF9tb2RpZmllZCwgc2Vzc2lvbi5pZCk7XG4gICAgICAgIGlmIChxdWVyeS5jaGFuZ2VzICE9PSAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHNlc3Npb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlbGV0ZV9leHBpcmVkX3Nlc3Npb25zID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqKSA9PiB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICBkYXRhYmFzZS5wcmVwYXJlKGBERUxFVEUgRlJPTSBzZXNzaW9uc19jb250ZW50cyBXSEVSRSBleHBpcmVzX2F0IDwgP2ApLnJ1bih0aW1lKTtcbiAgICAgICAgZGF0YWJhc2UucHJlcGFyZShgREVMRVRFIEZST00gc2Vzc2lvbnMgV0hFUkUgZXhwaXJlc19hdCA8ID9gKS5ydW4odGltZSk7XG5cbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgIH0pO1xufSIsImltcG9ydCB7IERhdGFiYXNlU2Vzc2lvbkZpbGUgfSBmcm9tIFwiLi91dGlscy9kYm1vZGVsc1wiO1xuXG5pbnRlcmZhY2UgU2Vzc2lvbkRUTyB7XG4gICAgaWQ6IHN0cmluZyxcbiAgICBhdXRob3I/OiBzdHJpbmcsXG4gICAgbW9kdWxlczogUmVjb3JkPHN0cmluZywgTW9kdWxlRFRPPixcbiAgICBmaWxlczogRGF0YWJhc2VTZXNzaW9uRmlsZVtdLFxuICAgIGxhc3RfbW9kaWZpZWQ6IG51bWJlcixcbiAgICBleHBpcmVzX2F0OiBudW1iZXIsXG59O1xuXG5pbnRlcmZhY2UgTW9kdWxlRFRPIHtcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgZnVuY3Rpb25zOiBGdW5jdGlvbkRUT1tdLFxufVxuXG5pbnRlcmZhY2UgRnVuY3Rpb25EVE8ge1xuICAgIG1vZHVsZTogc3RyaW5nIHwgbnVsbCxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgcmV0dXJuX3R5cGU6IHN0cmluZyxcbiAgICBwYXJhbWV0ZXJfdHlwZXM6IHN0cmluZ1tdLFxuICAgIGNvbXBsZXRpb246IHN0cmluZyxcbn1cblxuY29uc3QgZGVtb0NvZGUgPSBgXG5pbXBvcnQgYm90O1xuXG5pbnQgbWFpbigpIHtcbiAgIGJvdC5jaGF0KFwiSGVsbG8gV29ybGQhXCIpO1xuICAgcmV0dXJuIDA7XG59XG5gLnRyaW0oKTtcblxuZXhwb3J0IGNvbnN0IGRlbW9TZXNzaW9uOiBTZXNzaW9uRFRPID0ge1xuICAgIGlkOiBcImRlbW9cIixcbiAgICBhdXRob3I6IFwiRGVtb1wiLFxuICAgIG1vZHVsZXM6IHtcbiAgICAgICAgYm90OiB7XG4gICAgICAgICAgICBuYW1lOiBcImJvdFwiLFxuICAgICAgICAgICAgZnVuY3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiY2hhdFwiLCByZXR1cm5fdHlwZTogXCJpbnRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJjaGF0KCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJkZXBvc2l0X2l0ZW1cIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwiZGVwb3NpdF9pdGVtKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJnZXRfYmxvY2tcIiwgcmV0dXJuX3R5cGU6IFwic3RyaW5nXCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwiZ2V0X2Jsb2NrKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJnZXRfZGlyZWN0aW9uXCIsIHJldHVybl90eXBlOiBcInN0cmluZ1wiLCBwYXJhbWV0ZXJfdHlwZXM6IFtdLCBjb21wbGV0aW9uOiBcImdldF9kaXJlY3Rpb24oKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJnZXRfaXRlbVwiLCByZXR1cm5fdHlwZTogXCJzdHJpbmdcIiwgcGFyYW1ldGVyX3R5cGVzOiBbXSwgY29tcGxldGlvbjogXCJnZXRfaXRlbSgpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcImdldF9zZWxlY3RlZF9zbG90XCIsIHJldHVybl90eXBlOiBcIm51bWJlclwiLCBwYXJhbWV0ZXJfdHlwZXM6IFtdLCBjb21wbGV0aW9uOiBcImdldF9zZWxlY3RlZF9zbG90KCkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwibW92ZVwiLCByZXR1cm5fdHlwZTogXCJpbnRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJtb3ZlKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJwcmludFwiLCByZXR1cm5fdHlwZTogXCJpbnRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJwcmludCgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwicm90YXRlX2xlZnRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogW10sIGNvbXBsZXRpb246IFwicm90YXRlX2xlZnQoKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJyb3RhdGVfcmlnaHRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogW10sIGNvbXBsZXRpb246IFwicm90YXRlX3JpZ2h0KCkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwic2VsZWN0X3Nsb3RcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcImludFwiIF0sIGNvbXBsZXRpb246IFwic2VsZWN0X3Nsb3QoJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcInNldF9zdGF0dXNcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiLCBcImludFwiIF0sIGNvbXBsZXRpb246IFwic2V0X3N0YXR1cygkMSwgJDIpJDBcIiB9LFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBtYXRoOiB7XG4gICAgICAgICAgICBuYW1lOiBcIm1hdGhcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uczogW1xuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcIm1hdGhcIiwgbmFtZTogXCJjZWlsXCIsIHJldHVybl90eXBlOiBcImZsb2F0XCIsIHBhcmFtZXRlcl90eXBlczogWyBcImZsb2F0XCIgXSwgY29tcGxldGlvbjogXCJjZWlsKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwiY29zXCIsIHJldHVybl90eXBlOiBcImZsb2F0XCIsIHBhcmFtZXRlcl90eXBlczogWyBcImZsb2F0XCIgXSwgY29tcGxldGlvbjogXCJjb3MoJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcIm1hdGhcIiwgbmFtZTogXCJmbG9vclwiLCByZXR1cm5fdHlwZTogXCJmbG9hdFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJmbG9hdFwiIF0sIGNvbXBsZXRpb246IFwiZmxvb3IoJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcIm1hdGhcIiwgbmFtZTogXCJyb3VuZFwiLCByZXR1cm5fdHlwZTogXCJmbG9hdFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJmbG9hdFwiIF0sIGNvbXBsZXRpb246IFwicm91bmQoJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcIm1hdGhcIiwgbmFtZTogXCJzaW5cIiwgcmV0dXJuX3R5cGU6IFwiZmxvYXRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwiZmxvYXRcIiBdLCBjb21wbGV0aW9uOiBcInNpbigkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwibWF0aFwiLCBuYW1lOiBcInNxcnRcIiwgcmV0dXJuX3R5cGU6IFwiZmxvYXRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwiZmxvYXRcIiBdLCBjb21wbGV0aW9uOiBcInNxcnQoJDEpJDBcIiB9LFxuICAgICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICBsYW5nOiB7XG4gICAgICAgICAgICBuYW1lOiBcImxhbmdcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uczogW1xuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBudWxsLCBuYW1lOiBcInN0cmxlblwiLCByZXR1cm5fdHlwZTogXCJpbnRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJzdHJsZW4oJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBudWxsLCBuYW1lOiBcImlzX2ludFwiLCByZXR1cm5fdHlwZTogXCJpbnRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJpc19pbnQoJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBudWxsLCBuYW1lOiBcInRvX2ludFwiLCByZXR1cm5fdHlwZTogXCJpbnRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJ0b19pbnQoJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBudWxsLCBuYW1lOiBcImlzX2Zsb2F0XCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJzdHJpbmdcIiBdLCBjb21wbGV0aW9uOiBcImlzX2Zsb2F0KCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJ0b19mbG9hdFwiLCByZXR1cm5fdHlwZTogXCJmbG9hdFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJzdHJpbmdcIiBdLCBjb21wbGV0aW9uOiBcInRvX2Zsb2F0KCQxKSQwXCIgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZmlsZXM6IFt7IGlkOiBcIm1haW4uY2JzXCIsIG5hbWU6IFwibWFpbi5jYnNcIiwgbGFzdF9tb2RpZmllZDogRGF0ZS5ub3coKSwgY29udGVudDogZGVtb0NvZGUgfV0sXG4gICAgbGFzdF9tb2RpZmllZDogMCxcbiAgICBleHBpcmVzX2F0OiAwLFxufTsiLCJpbXBvcnQgeyBBcHBsaWNhdGlvbiB9IGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgeyBoYW5kbGVTZXJ2ZXJDcmVhdGUgfSBmcm9tIFwiLi9jb250cm9sbGVycy9zZXJ2ZXItY29udHJvbGxlclwiO1xuaW1wb3J0IHsgaGFuZGxlRGVtb1Nlc3Npb25HZXQsIGhhbmRsZVNlc3Npb25DcmVhdGUsIGhhbmRsZVNlc3Npb25HZXQsIGhhbmRsZVNlc3Npb25VcGRhdGUgfSBmcm9tIFwiLi9jb250cm9sbGVycy9zZXNzaW9uLWNvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldHVwUm91dGVzKGV4cHJlc3M6IEFwcGxpY2F0aW9uKSB7XG5cbiAgICBleHByZXNzLnBvc3QoXCIvYXBpL3NlcnZlcnNcIiwgaGFuZGxlU2VydmVyQ3JlYXRlKTtcblxuICAgIGV4cHJlc3MucG9zdChcIi9hcGkvc2Vzc2lvbnNcIiwgaGFuZGxlU2Vzc2lvbkNyZWF0ZSk7XG4gICAgZXhwcmVzcy5nZXQoXCIvYXBpL3Nlc3Npb25zL2RlbW9cIiwgaGFuZGxlRGVtb1Nlc3Npb25HZXQpO1xuICAgIGV4cHJlc3MuZ2V0KFwiL2FwaS9zZXNzaW9ucy86c2Vzc2lvbklkXCIsIGhhbmRsZVNlc3Npb25HZXQpO1xuICAgIGV4cHJlc3MucHV0KFwiL2FwaS9zZXNzaW9ucy86c2Vzc2lvbklkXCIsIGhhbmRsZVNlc3Npb25VcGRhdGUpO1xuXG59IiwiaW1wb3J0IGp3dCBmcm9tICdqc29ud2VidG9rZW4nO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVG9rZW48VCBleHRlbmRzIG9iamVjdD4ocGF5bG9hZDogVCwgdGltZVZhbGlkOiBudW1iZXIpIHtcbiAgICByZXR1cm4gand0LnNpZ24ocGF5bG9hZCwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCBhcyBzdHJpbmcsIHtcbiAgICAgICAgZXhwaXJlc0luOiBEYXRlLm5vdygpICsgdGltZVZhbGlkXG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJpZnlUb2tlbjxUIGV4dGVuZHMgb2JqZWN0Pih0b2tlbjogc3RyaW5nKTogVCB8IG51bGwge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBqd3QudmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIGFzIHN0cmluZykgYXMgVDtcbiAgICB9IGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBWZXJzaW9uIHtcbiAgICBcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFMUEhBOiBudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQkVUQTogbnVtYmVyID0gMTtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFTEVBU0U6IG51bWJlciA9IDI1NTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBWRVJTSU9OX1JFR0VYOiBSZWdFeHAgPSAvXlxcZCsoXFwuXFxkKykqW2FiXT8kLztcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IElOVkFMSUQ6IFZlcnNpb24gPSBuZXcgVmVyc2lvbihbXSwgVmVyc2lvbi5BTFBIQSk7XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFZfMF81XzFfTVVMVElQTEVfRklMRVNfRURJVElORyA9IFZlcnNpb24uZnJvbShcIjAuNS4xXCIpO1xuICAgIFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2VnbWVudHM6IG51bWJlcltdO1xuICAgIHB1YmxpYyByZWFkb25seSBjaGFubmVsOiBudW1iZXI7XG4gICAgcHVibGljIHJlYWRvbmx5IHN0cmluZ2lmaWVkOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHNlZ21lbnRzOiBudW1iZXJbXSwgY2hhbm5lbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuc2VnbWVudHMgPSBzZWdtZW50cztcbiAgICAgICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcbiAgICAgICAgdGhpcy5zdHJpbmdpZmllZCA9IHNlZ21lbnRzLmpvaW4oXCIuXCIpICsgVmVyc2lvbi5nZXRDaGFubmVsQ2hhcihjaGFubmVsKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZyb20oaW5wdXQ6IHN0cmluZyk6IFZlcnNpb24ge1xuICAgICAgICBpZiAoIVZlcnNpb24uVkVSU0lPTl9SRUdFWC50ZXN0KGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIFZlcnNpb24uSU5WQUxJRDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY2hhbm5lbDogbnVtYmVyO1xuICAgICAgICBpZiAoaW5wdXQuZW5kc1dpdGgoXCJhXCIpIHx8IGlucHV0LmVuZHNXaXRoKFwiYlwiKSkge1xuICAgICAgICAgICAgY2hhbm5lbCA9IGlucHV0LmVuZHNXaXRoKFwiYVwiKSA/IFZlcnNpb24uQUxQSEEgOiBWZXJzaW9uLkJFVEE7XG4gICAgICAgICAgICBpbnB1dCA9IGlucHV0LnNsaWNlKDAsIC0xKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoYW5uZWwgPSBWZXJzaW9uLlJFTEVBU0U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByYXdTZWdtZW50cyA9IGlucHV0LmluY2x1ZGVzKFwiLlwiKSA/IGlucHV0LnNwbGl0KFwiLlwiKSA6IFtpbnB1dF07XG4gICAgICAgIGNvbnN0IHNlZ21lbnRzID0gcmF3U2VnbWVudHMubWFwKFZlcnNpb24udG9TZWdtZW50KTtcblxuICAgICAgICByZXR1cm4gbmV3IFZlcnNpb24oc2VnbWVudHMsIGNoYW5uZWwpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIHRvU2VnbWVudChpbnB1dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgfVxuXG4gICAgcHVibGljIGlzVmFsaWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzICE9PSBWZXJzaW9uLklOVkFMSUQ7XG4gICAgfVxuXG4gICAgcHVibGljIGlzT2xkZXJUaGFuKHZlcnNpb246IFZlcnNpb24pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZSh2ZXJzaW9uKSA8IDA7XG4gICAgfVxuXG4gICAgcHVibGljIGlzTmV3ZXJUaGFuKHZlcnNpb246IFZlcnNpb24pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcGFyZSh2ZXJzaW9uKSA+IDA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjb21wYXJlKHZlcnNpb246IFZlcnNpb24pOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcyA9PT0gVmVyc2lvbi5JTlZBTElEKSByZXR1cm4gLTE7XG4gICAgICAgIGlmICh2ZXJzaW9uID09PSBWZXJzaW9uLklOVkFMSUQpIHJldHVybiAxO1xuXG4gICAgICAgIGNvbnN0IG1pbkxlbmd0aCA9IE1hdGgubWluKHRoaXMuc2VnbWVudHMubGVuZ3RoLCB2ZXJzaW9uLnNlZ21lbnRzLmxlbmd0aCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWluTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlZ21lbnRzW2ldIDwgdmVyc2lvbi5zZWdtZW50c1tpXSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VnbWVudHNbaV0gPiB2ZXJzaW9uLnNlZ21lbnRzW2ldKSByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnNlZ21lbnRzLmxlbmd0aCA9PT0gdmVyc2lvbi5zZWdtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJzaW9uLmNvbXBhcmVDaGFubmVsKHRoaXMuY2hhbm5lbCwgdmVyc2lvbi5jaGFubmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGdyZWF0ZXJTZWdtZW50ID0gdGhpcy5zZWdtZW50cy5sZW5ndGggPT09IG1pbkxlbmd0aCA/IHZlcnNpb24uc2VnbWVudHMgOiB0aGlzLnNlZ21lbnRzO1xuICAgICAgICBmb3IgKGxldCBpID0gbWluTGVuZ3RoOyBpIDwgZ3JlYXRlclNlZ21lbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChncmVhdGVyU2VnbWVudFtpXSAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBncmVhdGVyU2VnbWVudCA9PT0gdGhpcy5zZWdtZW50cyA/IDEgOiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBWZXJzaW9uLmNvbXBhcmVDaGFubmVsKHRoaXMuY2hhbm5lbCwgdmVyc2lvbi5jaGFubmVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjb21wYXJlQ2hhbm5lbChjaDE6IG51bWJlciwgY2gyOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gY2gxIC0gY2gyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGdldENoYW5uZWxDaGFyKGNoYW5uZWw6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIHN3aXRjaCAoY2hhbm5lbCkge1xuICAgICAgICAgICAgY2FzZSBWZXJzaW9uLkFMUEhBOlxuICAgICAgICAgICAgICAgIHJldHVybiBcImFcIjtcbiAgICAgICAgICAgIGNhc2UgVmVyc2lvbi5CRVRBOlxuICAgICAgICAgICAgICAgIHJldHVybiBcImJcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmV0dGVyLXNxbGl0ZTNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29va2llLXBhcnNlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb3RlbnZcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXVpZFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=