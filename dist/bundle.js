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
exports.handleSessionDelete = exports.handleSessionUpdate = exports.handleSessionStatusGet = exports.handleDemoSessionStatusGet = exports.handleSessionGet = exports.handleDemoSessionGet = exports.handleSessionCreate = void 0;
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
    res.json(Object.assign({}, (yield (0, database_1.create_session)(id, rawVersion, req.body.author, req.body.modules, sessionFiles))));
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
        result.author = session.author;
        result.modules = JSON.parse(session.modules);
        result.files = session.files;
        result.last_modified = session.last_modified;
        result.expires_at = session.expires_at;
    }
    res.json(result);
});
exports.handleSessionGet = handleSessionGet;
const handleDemoSessionStatusGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).end();
});
exports.handleDemoSessionStatusGet = handleDemoSessionStatusGet;
const handleSessionStatusGet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    // Check if there are changes if "last_change_id" is present
    if (req.query.last_modified && session.last_modified === parseInt(req.query.last_modified)) {
        res.status(200).end();
        return;
    }
    res.status(200).end();
});
exports.handleSessionStatusGet = handleSessionStatusGet;
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
const handleSessionDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const session = (yield (0, database_1.get_session)(id));
    if (session === undefined || session === null) {
        res.status(404).end();
        return;
    }
    yield (0, database_1.delete_session)(session);
    res.status(200).end();
});
exports.handleSessionDelete = handleSessionDelete;


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
exports.delete_expired_sessions = exports.delete_session = exports.update_session = exports.update_session_file = exports.create_session = exports.get_session = void 0;
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
// TODO: Use foreign keys and cascade on delete instead of the abomination at the bottom
database.exec(`CREATE TABLE IF NOT EXISTS sessions (id PRIMARY KEY, server_id TEXT, plugin_version TEXT, access_token TEXT, author TEXT, modules TEXT, created_at BIGINT, expires_at BIGINT, last_modified BIGINT)`);
database.exec(`CREATE TABLE IF NOT EXISTS sessions_contents (id PRIMARY KEY, name VARCHAR(24), session_id TEXT, content TEXT(2048), last_modified BIGINT)`);
const get_session = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, rej) => {
        const result = database.prepare("SELECT * FROM sessions WHERE id = ? LIMIT 1").get(id);
        const files = database.prepare("SELECT * FROM sessions_contents WHERE session_id = ?").all(id) || [];
        if (result) {
            resolve(Object.assign(Object.assign({}, result), { files }));
        }
        else {
            resolve(null);
        }
    });
});
exports.get_session = get_session;
const create_session = (server_id, plugin_version, author, modules, files) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, uuid_1.v7)();
    const duration = 3600 * 2;
    const expires_at = Date.now() + duration * 1000;
    Object.values(modules).forEach((m) => {
        m.functions.forEach((fun) => {
            if (m.auto_import) {
                fun.module = null;
            }
            else {
                fun.module = m.name;
            }
            fun.completion = `${fun.name}(${fun.parameter_types.map((type, idx) => `$${idx + 1}`).join(", ")})$0`;
        });
        delete m["auto_import"];
    });
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
        author,
        modules: JSON.stringify(modules),
        last_modified: 0
    };
    console.log(session);
    return new Promise((resolve, rej) => {
        const stmt = database.prepare(`INSERT INTO sessions (id, server_id, plugin_version, access_token, author, modules, created_at, expires_at, last_modified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        const results = stmt.run(session.id, server_id, session.plugin_version, session.access_token, session.author, session.modules, session.created_at, session.expires_at, 0);
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
const delete_session = (session) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, rej) => {
        database.prepare(`DELETE FROM sessions_contents WHERE session_id = ?`).run(session.id);
        database.prepare(`DELETE FROM sessions WHERE id = ?`).run(session.id);
        resolve();
    });
});
exports.delete_session = delete_session;
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
    express.get("/api/sessions/demo/status", session_controller_1.handleDemoSessionStatusGet);
    express.get("/api/sessions/:sessionId/status", session_controller_1.handleSessionStatusGet);
    express.put("/api/sessions/:sessionId", session_controller_1.handleSessionUpdate);
    express.delete("/api/sessions/:sessionId", session_controller_1.handleSessionDelete);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Qzs7Ozs7Ozs7OztBQ0FBLGlDOzs7Ozs7Ozs7O0FDQUEsK0I7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUU1QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC8uL3NyYy9jb250cm9sbGVycy9zZXJ2ZXItY29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvLi9zcmMvY29udHJvbGxlcnMvc2Vzc2lvbi1jb250cm9sbGVyLnRzIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC8uL3NyYy9kYXRhYmFzZS50cyIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvLi9zcmMvZGVtby50cyIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvLi9zcmMvcm91dGVzLnRzIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC8uL3NyYy91dGlscy9qd3QudHMiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kLy4vc3JjL3V0aWxzL3ZlcnNpb25zLnRzIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImJldHRlci1zcWxpdGUzXCIiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL2V4dGVybmFsIGNvbW1vbmpzIFwiY29va2llLXBhcnNlclwiIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImRvdGVudlwiIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJ1dWlkXCIiLCJ3ZWJwYWNrOi8vY2JzLWVkaXRvci1iYWNrZW5kL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJmc1wiIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jYnMtZWRpdG9yLWJhY2tlbmQvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Nicy1lZGl0b3ItYmFja2VuZC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgc2V0dXBSb3V0ZXMgfSBmcm9tIFwiLi9yb3V0ZXNcIjtcbmltcG9ydCB7IGNvbmZpZ0RvdGVudiB9IGZyb20gXCJkb3RlbnZcIjtcbmltcG9ydCBjb29raWVQYXJzZXIgZnJvbSBcImNvb2tpZS1wYXJzZXJcIjtcblxuY29uZmlnRG90ZW52KCk7XG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MuZGVmYXVsdCgpO1xuYXBwLnVzZShjb29raWVQYXJzZXIoKSk7XG5hcHAudXNlKGV4cHJlc3MuanNvbigpKTtcblxuc2V0dXBSb3V0ZXMoYXBwKTtcblxuYXBwLmxpc3Rlbihwcm9jZXNzLmVudi5QT1JUKTsiLCJpbXBvcnQgeyBjcmVhdGVUb2tlbiB9IGZyb20gXCIuLi91dGlscy9qd3RcIjtcbmltcG9ydCB7IHY3IGFzIHV1aWQgfSBmcm9tIFwidXVpZFwiO1xuaW1wb3J0IHsgSnd0U2VydmVyQ2xhaW1zIH0gZnJvbSBcIi4uL3R5cGVzL2p3dC1jbGFpbXMtdHlwZXNcIjtcbmltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tIFwiLi4vdHlwZXMvY29udHJvbGxlclwiO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlU2VydmVyQ3JlYXRlOiBDb250cm9sbGVyID0gKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgdmVyc2lvbiA9IHJlcS5ib2R5LnZlcnNpb247XG4gICAgaWYgKHR5cGVvZiB2ZXJzaW9uICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXMuc3RhdHVzKDIwMCkuc2VuZChcbiAgICAgICAgY3JlYXRlVG9rZW48Snd0U2VydmVyQ2xhaW1zPih7XG4gICAgICAgICAgICBpZDogdXVpZCgpLFxuICAgICAgICAgICAgdmVyc2lvbixcbiAgICAgICAgfSwgMyAqIDYwICogNjApXG4gICAgKTtcbn0iLCJpbXBvcnQgeyBjcmVhdGVfc2Vzc2lvbiwgZGVsZXRlX3Nlc3Npb24sIGdldF9zZXNzaW9uLCB1cGRhdGVfc2Vzc2lvbiwgdXBkYXRlX3Nlc3Npb25fZmlsZSB9IGZyb20gXCIuLi9kYXRhYmFzZVwiO1xuaW1wb3J0IHsgZGVtb1Nlc3Npb24gfSBmcm9tIFwiLi4vZGVtb1wiO1xuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gXCIuLi90eXBlcy9jb250cm9sbGVyXCJcbmltcG9ydCB7IEp3dEVkaXRvclNlc3Npb25DbGFpbXMsIEp3dFNlcnZlckNsYWltcyB9IGZyb20gXCIuLi90eXBlcy9qd3QtY2xhaW1zLXR5cGVzXCI7XG5pbXBvcnQgeyBEYXRhYmFzZVNlc3Npb24sIERhdGFiYXNlU2Vzc2lvbkZpbGUgfSBmcm9tIFwiLi4vdXRpbHMvZGJtb2RlbHNcIjtcbmltcG9ydCB7IHZlcmlmeVRva2VuIH0gZnJvbSBcIi4uL3V0aWxzL2p3dFwiO1xuaW1wb3J0IHsgVmVyc2lvbiB9IGZyb20gXCIuLi91dGlscy92ZXJzaW9uc1wiO1xuaW1wb3J0IHsgdjcgYXMgdXVpZCB9IGZyb20gXCJ1dWlkXCI7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTZXNzaW9uQ3JlYXRlOiBDb250cm9sbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgYXV0aG9yaXphdGlvbiA9IHJlcS5oZWFkZXJzW1wiYXV0aG9yaXphdGlvblwiXTtcbiAgICBpZiAoYXV0aG9yaXphdGlvbiA9PT0gdW5kZWZpbmVkIHx8ICFhdXRob3JpemF0aW9uPy5zdGFydHNXaXRoKFwiQmVhcmVyIFwiKSkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IGF1dGhvcml6YXRpb24uc3Vic3RyaW5nKFwiQmVhcmVyIFwiLmxlbmd0aCk7XG4gICAgY29uc3QgY2xhaW1zID0gdmVyaWZ5VG9rZW48Snd0U2VydmVyQ2xhaW1zPih0b2tlbik7XG5cbiAgICBpZiAoY2xhaW1zID09PSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAxKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgaWQsIHZlcnNpb246IHJhd1ZlcnNpb24gfSA9IGNsYWltcztcbiAgICBjb25zdCB2ZXJzaW9uID0gVmVyc2lvbi5mcm9tKHJhd1ZlcnNpb24pO1xuXG4gICAgY29uc3Qgc2Vzc2lvbkZpbGVzOiBEYXRhYmFzZVNlc3Npb25GaWxlW10gPSBbXTtcbiAgICBpZiAodmVyc2lvbi5pc09sZGVyVGhhbihWZXJzaW9uLlZfMF81XzFfTVVMVElQTEVfRklMRVNfRURJVElORykpIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IHJlcS5ib2R5LmZpbGU7XG4gICAgICAgIGlmICh0eXBlb2YgY29udGVudCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlc3Npb25GaWxlcy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiB1dWlkKCksXG4gICAgICAgICAgICBuYW1lOiBcInByb2dyYW0uY2JmXCIsXG4gICAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgbGFzdF9jaGFuZ2VfaWQ6IFwiXCIsXG4gICAgICAgICAgICBsYXN0X2NoYW5nZV90aW1lc3RhbXA6IDBcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSByZXEuYm9keS5maWxlcyBhcyBEYXRhYmFzZVNlc3Npb25GaWxlW107XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShmaWxlcykpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgc2Vzc2lvbkZpbGVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGlkOiB1dWlkKCksXG4gICAgICAgICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGZpbGUuY29udGVudCxcbiAgICAgICAgICAgICAgICBsYXN0X21vZGlmaWVkOiAwXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlcy5qc29uKHtcbiAgICAgICAgLi4uKGF3YWl0IGNyZWF0ZV9zZXNzaW9uKGlkIGFzIHN0cmluZywgcmF3VmVyc2lvbiwgcmVxLmJvZHkuYXV0aG9yLCByZXEuYm9keS5tb2R1bGVzLCBzZXNzaW9uRmlsZXMpKVxuICAgIH0pXG59O1xuXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVEZW1vU2Vzc2lvbkdldDogQ29udHJvbGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcbiAgICAgICAgLi4uZGVtb1Nlc3Npb24sXG4gICAgICAgIGxhc3RfbW9kaWZpZWQ6IERhdGUubm93KCksXG4gICAgICAgIGV4cGlyZXNfYXQ6IERhdGUubm93KCkgKyAzICogNjAgKiA2MCAqIDEwMDAsXG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgaGFuZGxlU2Vzc2lvbkdldDogQ29udHJvbGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGlkID0gcmVxLnBhcmFtcy5zZXNzaW9uSWQgYXMgc3RyaW5nO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbj8uc3Vic3RyaW5nKFwiQmVhcmVyIFwiLmxlbmd0aCk7XG5cbiAgICAvLyBDaGVjayBpZiBhY2Nlc3MgdG9rZW4gaXMgcHJlc2VudCBpbiBjb29raWVzXG4gICAgaWYgKHR5cGVvZiBhY2Nlc3NUb2tlbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGFjY2VzcyB0b2tlbiBpcyB2YWxpZFxuICAgIGNvbnN0IGNsYWltcyA9IHZlcmlmeVRva2VuPEp3dEVkaXRvclNlc3Npb25DbGFpbXM+KGFjY2Vzc1Rva2VuKTtcbiAgICBpZiAoY2xhaW1zID09IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNsYWltcyBhcmUgdmFsaWRcbiAgICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICBpZiAodGltZSA+PSBjbGFpbXMuZXhwaXJlc19hdCB8fCBjbGFpbXMuaWQgIT09IGlkKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAzKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlc3Npb24gPSAoYXdhaXQgZ2V0X3Nlc3Npb24oaWQpKSBhcyBEYXRhYmFzZVNlc3Npb24gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIGlmIChzZXNzaW9uID09PSB1bmRlZmluZWQgfHwgc2Vzc2lvbiA9PT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhdHVzKDQwNCkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgdG9rZW5zIG1hdGNoXG4gICAgaWYgKHNlc3Npb24uYWNjZXNzX3Rva2VuICE9PSBhY2Nlc3NUb2tlbikge1xuICAgICAgICByZXMuc3RhdHVzKDQwMykuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgcGx1Z2luX3ZlcnNpb24gPSBWZXJzaW9uLmZyb20oc2Vzc2lvbi5wbHVnaW5fdmVyc2lvbik7XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgY2hhbmdlcyBpZiBcImxhc3RfY2hhbmdlX2lkXCIgaXMgcHJlc2VudFxuICAgIGlmIChyZXEucXVlcnkubGFzdF9tb2RpZmllZCAmJiBzZXNzaW9uLmxhc3RfbW9kaWZpZWQgPT09IHBhcnNlSW50KHJlcS5xdWVyeS5sYXN0X21vZGlmaWVkIGFzIHN0cmluZykpIHtcbiAgICAgICAgcmVzLnN0YXR1cygzMDQpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0OiBhbnkgPSB7fTtcbiAgICBpZiAocGx1Z2luX3ZlcnNpb24uaXNPbGRlclRoYW4oVmVyc2lvbi5WXzBfNV8xX01VTFRJUExFX0ZJTEVTX0VESVRJTkcpKSB7XG4gICAgICAgIHJlc3VsdFtcImNvbnRlbnRcIl0gPSBzZXNzaW9uLmZpbGVzWzBdLmNvbnRlbnQ7XG4gICAgICAgIHJlc3VsdFtcImxhc3RfY2hhbmdlX2lkXCJdID0gc2Vzc2lvbi5maWxlc1swXS5sYXN0X21vZGlmaWVkLnRvU3RyaW5nKCk7XG4gICAgICAgIHJlc3VsdFtcImxhc3RfY2hhbmdlX3RpbWVzdGFtcFwiXSA9IHNlc3Npb24uZmlsZXNbMF0ubGFzdF9tb2RpZmllZDtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQuaWQgPSBzZXNzaW9uLmlkO1xuICAgICAgICByZXN1bHQuYXV0aG9yID0gc2Vzc2lvbi5hdXRob3I7XG4gICAgICAgIHJlc3VsdC5tb2R1bGVzID0gSlNPTi5wYXJzZShzZXNzaW9uLm1vZHVsZXMpO1xuICAgICAgICByZXN1bHQuZmlsZXMgPSBzZXNzaW9uLmZpbGVzO1xuICAgICAgICByZXN1bHQubGFzdF9tb2RpZmllZCA9IHNlc3Npb24ubGFzdF9tb2RpZmllZDtcbiAgICAgICAgcmVzdWx0LmV4cGlyZXNfYXQgPSBzZXNzaW9uLmV4cGlyZXNfYXQ7XG4gICAgfVxuICAgIHJlcy5qc29uKHJlc3VsdCk7XG5cbn07XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVEZW1vU2Vzc2lvblN0YXR1c0dldDogQ29udHJvbGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIHJlcy5zdGF0dXMoMjAwKS5lbmQoKTtcbn07XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTZXNzaW9uU3RhdHVzR2V0OiBDb250cm9sbGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgaWQgPSByZXEucGFyYW1zLnNlc3Npb25JZCBhcyBzdHJpbmc7XG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uPy5zdWJzdHJpbmcoXCJCZWFyZXIgXCIubGVuZ3RoKTtcblxuICAgIC8vIENoZWNrIGlmIGFjY2VzcyB0b2tlbiBpcyBwcmVzZW50IGluIGNvb2tpZXNcbiAgICBpZiAodHlwZW9mIGFjY2Vzc1Rva2VuICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgYWNjZXNzIHRva2VuIGlzIHZhbGlkXG4gICAgY29uc3QgY2xhaW1zID0gdmVyaWZ5VG9rZW48Snd0RWRpdG9yU2Vzc2lvbkNsYWltcz4oYWNjZXNzVG9rZW4pO1xuICAgIGlmIChjbGFpbXMgPT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMSkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgY2xhaW1zIGFyZSB2YWxpZFxuICAgIGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGlmICh0aW1lID49IGNsYWltcy5leHBpcmVzX2F0IHx8IGNsYWltcy5pZCAhPT0gaWQpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDMpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2Vzc2lvbiA9IChhd2FpdCBnZXRfc2Vzc2lvbihpZCkpIGFzIERhdGFiYXNlU2Vzc2lvbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgaWYgKHNlc3Npb24gPT09IHVuZGVmaW5lZCB8fCBzZXNzaW9uID09PSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDA0KS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZSB0b2tlbnMgbWF0Y2hcbiAgICBpZiAoc2Vzc2lvbi5hY2Nlc3NfdG9rZW4gIT09IGFjY2Vzc1Rva2VuKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAzKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBjaGFuZ2VzIGlmIFwibGFzdF9jaGFuZ2VfaWRcIiBpcyBwcmVzZW50XG4gICAgaWYgKHJlcS5xdWVyeS5sYXN0X21vZGlmaWVkICYmIHNlc3Npb24ubGFzdF9tb2RpZmllZCA9PT0gcGFyc2VJbnQocmVxLnF1ZXJ5Lmxhc3RfbW9kaWZpZWQgYXMgc3RyaW5nKSkge1xuICAgICAgICByZXMuc3RhdHVzKDIwMCkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXMuc3RhdHVzKDIwMCkuZW5kKCk7XG59O1xuXG5leHBvcnQgY29uc3QgaGFuZGxlU2Vzc2lvblVwZGF0ZTogQ29udHJvbGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGlkID0gcmVxLnBhcmFtcy5zZXNzaW9uSWQgYXMgc3RyaW5nO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbj8uc3Vic3RyaW5nKFwiQmVhcmVyIFwiLmxlbmd0aCk7XG5cbiAgICAvLyBDaGVjayBpZiBhY2Nlc3MgdG9rZW4gaXMgcHJlc2VudCBpbiBjb29raWVzXG4gICAgaWYgKHR5cGVvZiBhY2Nlc3NUb2tlbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGFjY2VzcyB0b2tlbiBpcyB2YWxpZFxuICAgIGNvbnN0IGNsYWltcyA9IHZlcmlmeVRva2VuPEp3dEVkaXRvclNlc3Npb25DbGFpbXM+KGFjY2Vzc1Rva2VuKTtcbiAgICBpZiAoY2xhaW1zID09IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNsYWltcyBhcmUgdmFsaWRcbiAgICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICBpZiAodGltZSA+PSBjbGFpbXMuZXhwaXJlc19hdCB8fCBjbGFpbXMuaWQgIT09IGlkKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDAzKS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlc3Npb24gPSAoYXdhaXQgZ2V0X3Nlc3Npb24oaWQpKSBhcyBEYXRhYmFzZVNlc3Npb24gfCBudWxsIHwgdW5kZWZpbmVkO1xuICAgIGlmIChzZXNzaW9uID09PSB1bmRlZmluZWQgfHwgc2Vzc2lvbiA9PT0gbnVsbCkge1xuICAgICAgICByZXMuc3RhdHVzKDQwNCkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgdG9rZW5zIG1hdGNoXG4gICAgaWYgKHNlc3Npb24uYWNjZXNzX3Rva2VuICE9PSBhY2Nlc3NUb2tlbikge1xuICAgICAgICByZXMuc3RhdHVzKDQwMykuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgeyBmaWxlcyB9ID0gcmVxLmJvZHk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGZpbGVzKSkge1xuICAgICAgICByZXMuc3RhdHVzKDQwMCkuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0TW9kaWZpZWQgPSBEYXRlLm5vdygpO1xuICAgIHNlc3Npb24ubGFzdF9tb2RpZmllZCA9IGxhc3RNb2RpZmllZDtcblxuICAgIC8vIENoZWNrIGlmIGZpbGVzIGFyZSB2YWxpZFxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICBpZiAodHlwZW9mIGZpbGUuY29udGVudCAhPT0gJ3N0cmluZycgfHwgZmlsZS5jb250ZW50Lmxlbmd0aCA+IDIwNDgpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKS5lbmQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlc3Npb25GaWxlID0gc2Vzc2lvbi5maWxlcy5maW5kKGYgPT4gZi5pZCA9PT0gZmlsZS5pZCk7XG4gICAgICAgIGlmIChzZXNzaW9uRmlsZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwMCkuZW5kKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXNzaW9uRmlsZS5jb250ZW50ID0gZmlsZS5jb250ZW50O1xuICAgICAgICBzZXNzaW9uRmlsZS5sYXN0X21vZGlmaWVkID0gbGFzdE1vZGlmaWVkO1xuICAgICAgICBhd2FpdCB1cGRhdGVfc2Vzc2lvbl9maWxlKHNlc3Npb25GaWxlKTtcbiAgICB9XG5cbiAgICBhd2FpdCB1cGRhdGVfc2Vzc2lvbihzZXNzaW9uKTtcbiAgICByZXMuc3RhdHVzKDIwMCkuZW5kKCk7XG59O1xuXG5leHBvcnQgY29uc3QgaGFuZGxlU2Vzc2lvbkRlbGV0ZTogQ29udHJvbGxlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGlkID0gcmVxLnBhcmFtcy5zZXNzaW9uSWQgYXMgc3RyaW5nO1xuICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbj8uc3Vic3RyaW5nKFwiQmVhcmVyIFwiLmxlbmd0aCk7XG5cbiAgICAvLyBDaGVjayBpZiBhY2Nlc3MgdG9rZW4gaXMgcHJlc2VudCBpbiBjb29raWVzXG4gICAgaWYgKHR5cGVvZiBhY2Nlc3NUb2tlbiAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGFjY2VzcyB0b2tlbiBpcyB2YWxpZFxuICAgIGNvbnN0IGNsYWltcyA9IHZlcmlmeVRva2VuPEp3dEVkaXRvclNlc3Npb25DbGFpbXM+KGFjY2Vzc1Rva2VuKTtcbiAgICBpZiAoY2xhaW1zID09IG51bGwpIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MDEpLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2Vzc2lvbiA9IChhd2FpdCBnZXRfc2Vzc2lvbihpZCkpIGFzIERhdGFiYXNlU2Vzc2lvbiB8IG51bGwgfCB1bmRlZmluZWQ7XG4gICAgaWYgKHNlc3Npb24gPT09IHVuZGVmaW5lZCB8fCBzZXNzaW9uID09PSBudWxsKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoNDA0KS5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBhd2FpdCBkZWxldGVfc2Vzc2lvbihzZXNzaW9uKTtcbiAgICByZXMuc3RhdHVzKDIwMCkuZW5kKCk7XG59OyIsImltcG9ydCB7IHY3IGFzIHV1aWQgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IGNyZWF0ZVRva2VuIH0gZnJvbSAnLi91dGlscy9qd3QnO1xuaW1wb3J0IHsgSnd0RWRpdG9yU2Vzc2lvbkNsYWltcyB9IGZyb20gJy4vdHlwZXMvand0LWNsYWltcy10eXBlcyc7XG5pbXBvcnQgRGF0YWJhc2UgZnJvbSAnYmV0dGVyLXNxbGl0ZTMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IERhdGFiYXNlU2Vzc2lvbiwgRGF0YWJhc2VTZXNzaW9uRmlsZSB9IGZyb20gJy4vdXRpbHMvZGJtb2RlbHMnO1xuXG4hZnMuZXhpc3RzU3luYyhgLi9zdG9yYWdlYCkgJiYgZnMubWtkaXJTeW5jKGAuL3N0b3JhZ2VgKTtcbmNvbnN0IGRhdGFEaXJlY3RvcnkgPSBmcy5yZWFscGF0aFN5bmMoJy4vc3RvcmFnZScpO1xuXG5jb25zdCBkYXRhYmFzZSA9IERhdGFiYXNlKGRhdGFEaXJlY3RvcnkgKyBcIi9zZXNzaW9ucy5kYlwiLCB7XG4gICAgZmlsZU11c3RFeGlzdDogZmFsc2UsXG4gICAgcmVhZG9ubHk6IGZhbHNlXG59KTtcbmRhdGFiYXNlLnByYWdtYShcImpvdXJuYWxfbW9kZSA9IFdBTFwiKTtcblxuLy8gU2V0dXAgdGhlIGRhdGFiYXNlXG4vLyBUT0RPOiBVc2UgZm9yZWlnbiBrZXlzIGFuZCBjYXNjYWRlIG9uIGRlbGV0ZSBpbnN0ZWFkIG9mIHRoZSBhYm9taW5hdGlvbiBhdCB0aGUgYm90dG9tXG5kYXRhYmFzZS5leGVjKGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBzZXNzaW9ucyAoaWQgUFJJTUFSWSBLRVksIHNlcnZlcl9pZCBURVhULCBwbHVnaW5fdmVyc2lvbiBURVhULCBhY2Nlc3NfdG9rZW4gVEVYVCwgYXV0aG9yIFRFWFQsIG1vZHVsZXMgVEVYVCwgY3JlYXRlZF9hdCBCSUdJTlQsIGV4cGlyZXNfYXQgQklHSU5ULCBsYXN0X21vZGlmaWVkIEJJR0lOVClgKTtcbmRhdGFiYXNlLmV4ZWMoYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTIHNlc3Npb25zX2NvbnRlbnRzIChpZCBQUklNQVJZIEtFWSwgbmFtZSBWQVJDSEFSKDI0KSwgc2Vzc2lvbl9pZCBURVhULCBjb250ZW50IFRFWFQoMjA0OCksIGxhc3RfbW9kaWZpZWQgQklHSU5UKWApO1xuXG5leHBvcnQgY29uc3QgZ2V0X3Nlc3Npb24gPSBhc3luYyAoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZGF0YWJhc2UucHJlcGFyZShcIlNFTEVDVCAqIEZST00gc2Vzc2lvbnMgV0hFUkUgaWQgPSA/IExJTUlUIDFcIikuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBkYXRhYmFzZS5wcmVwYXJlKFwiU0VMRUNUICogRlJPTSBzZXNzaW9uc19jb250ZW50cyBXSEVSRSBzZXNzaW9uX2lkID0gP1wiKS5hbGwoaWQpIHx8IFtdO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgICAgICAgICAgZmlsZXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlX3Nlc3Npb24gPSBhc3luYyAoc2VydmVyX2lkOiBzdHJpbmcsIHBsdWdpbl92ZXJzaW9uOiBzdHJpbmcsIGF1dGhvcjogc3RyaW5nIHwgdW5kZWZpbmVkLCBtb2R1bGVzOiBhbnksIGZpbGVzOiBEYXRhYmFzZVNlc3Npb25GaWxlW10pOiBQcm9taXNlPGFueT4gPT4ge1xuICAgIGNvbnN0IGlkID0gdXVpZCgpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gMzYwMCAqIDI7XG4gICAgY29uc3QgZXhwaXJlc19hdCA9IERhdGUubm93KCkgKyBkdXJhdGlvbiAqIDEwMDA7XG5cbiAgICBPYmplY3QudmFsdWVzKG1vZHVsZXMpLmZvckVhY2goKG06IGFueSkgPT4ge1xuICAgICAgICBtLmZ1bmN0aW9ucy5mb3JFYWNoKChmdW46IGFueSkgPT4ge1xuICAgICAgICAgICAgaWYgKG0uYXV0b19pbXBvcnQpIHtcbiAgICAgICAgICAgICAgICBmdW4ubW9kdWxlID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnVuLm1vZHVsZSA9IG0ubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bi5jb21wbGV0aW9uID0gYCR7ZnVuLm5hbWV9KCR7ZnVuLnBhcmFtZXRlcl90eXBlcy5tYXAoKHR5cGU6IHN0cmluZywgaWR4OiBudW1iZXIpID0+IGAkJHtpZHggKyAxfWApLmpvaW4oXCIsIFwiKX0pJDBgO1xuICAgICAgICB9KTtcbiAgICAgICAgZGVsZXRlIG1bXCJhdXRvX2ltcG9ydFwiXTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlc3Npb246IERhdGFiYXNlU2Vzc2lvbiA9IHtcbiAgICAgICAgaWQsXG4gICAgICAgIGZpbGVzLFxuICAgICAgICBzZXJ2ZXJfaWQsXG4gICAgICAgIHBsdWdpbl92ZXJzaW9uLFxuICAgICAgICBhY2Nlc3NfdG9rZW46IGNyZWF0ZVRva2VuPEp3dEVkaXRvclNlc3Npb25DbGFpbXM+KHtcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgc2VydmVyX2lkLFxuICAgICAgICAgICAgZXhwaXJlc19hdFxuICAgICAgICB9LCBkdXJhdGlvbiksXG4gICAgICAgIGNyZWF0ZWRfYXQ6IERhdGUubm93KCksXG4gICAgICAgIGV4cGlyZXNfYXQsXG4gICAgICAgIGF1dGhvcixcbiAgICAgICAgbW9kdWxlczogSlNPTi5zdHJpbmdpZnkobW9kdWxlcyksXG4gICAgICAgIGxhc3RfbW9kaWZpZWQ6IDBcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coc2Vzc2lvbik7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBjb25zdCBzdG10ID0gZGF0YWJhc2UucHJlcGFyZShgSU5TRVJUIElOVE8gc2Vzc2lvbnMgKGlkLCBzZXJ2ZXJfaWQsIHBsdWdpbl92ZXJzaW9uLCBhY2Nlc3NfdG9rZW4sIGF1dGhvciwgbW9kdWxlcywgY3JlYXRlZF9hdCwgZXhwaXJlc19hdCwgbGFzdF9tb2RpZmllZCkgVkFMVUVTICg/LCA/LCA/LCA/LCA/LCA/LCA/LCA/LCA/KWApO1xuICAgICAgICBjb25zdCByZXN1bHRzID0gc3RtdC5ydW4oc2Vzc2lvbi5pZCwgc2VydmVyX2lkLCBzZXNzaW9uLnBsdWdpbl92ZXJzaW9uLCBzZXNzaW9uLmFjY2Vzc190b2tlbiwgc2Vzc2lvbi5hdXRob3IsIHNlc3Npb24ubW9kdWxlcywgc2Vzc2lvbi5jcmVhdGVkX2F0LCBzZXNzaW9uLmV4cGlyZXNfYXQsIDApO1xuXG4gICAgICAgIGNvbnN0IHN0bXRGaWxlcyA9IGRhdGFiYXNlLnByZXBhcmUoYElOU0VSVCBJTlRPIHNlc3Npb25zX2NvbnRlbnRzIChpZCwgbmFtZSwgc2Vzc2lvbl9pZCwgY29udGVudCwgbGFzdF9tb2RpZmllZCkgVkFMVUVTICg/LCA/LCA/LCA/LCA/KWApO1xuICAgICAgICBmaWxlcy5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgICAgICAgc3RtdEZpbGVzLnJ1bihmaWxlLmlkLCBmaWxlLm5hbWUsIHNlc3Npb24uaWQsIGZpbGUuY29udGVudCwgZmlsZS5sYXN0X21vZGlmaWVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdHMuY2hhbmdlcyAhPT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShzZXNzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlaigpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVfc2Vzc2lvbl9maWxlID0gYXN5bmMgKGZpbGU6IERhdGFiYXNlU2Vzc2lvbkZpbGUpOiBQcm9taXNlPERhdGFiYXNlU2Vzc2lvbkZpbGU+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBjb25zdCBxdWVyeSA9IGRhdGFiYXNlLnByZXBhcmUoYHVwZGF0ZSBzZXNzaW9uc19jb250ZW50cyBzZXQgY29udGVudCA9ID8sIGxhc3RfbW9kaWZpZWQgPSA/IHdoZXJlIGlkID0gP2ApLnJ1bihmaWxlLmNvbnRlbnQsIGZpbGUubGFzdF9tb2RpZmllZCwgZmlsZS5pZCk7XG4gICAgICAgIGlmIChxdWVyeS5jaGFuZ2VzICE9PSAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKGZpbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZV9zZXNzaW9uID0gYXN5bmMgKHNlc3Npb246IERhdGFiYXNlU2Vzc2lvbik6IFByb21pc2U8RGF0YWJhc2VTZXNzaW9uPiA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWopID0+IHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBkYXRhYmFzZS5wcmVwYXJlKGB1cGRhdGUgc2Vzc2lvbnMgc2V0IGxhc3RfbW9kaWZpZWQgPSA/IHdoZXJlIGlkID0gP2ApLnJ1bihzZXNzaW9uLmxhc3RfbW9kaWZpZWQsIHNlc3Npb24uaWQpO1xuICAgICAgICBpZiAocXVlcnkuY2hhbmdlcyAhPT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShzZXNzaW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlaigpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWxldGVfc2Vzc2lvbiA9IGFzeW5jIChzZXNzaW9uOiBEYXRhYmFzZVNlc3Npb24pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBkYXRhYmFzZS5wcmVwYXJlKGBERUxFVEUgRlJPTSBzZXNzaW9uc19jb250ZW50cyBXSEVSRSBzZXNzaW9uX2lkID0gP2ApLnJ1bihzZXNzaW9uLmlkKTtcbiAgICAgICAgZGF0YWJhc2UucHJlcGFyZShgREVMRVRFIEZST00gc2Vzc2lvbnMgV0hFUkUgaWQgPSA/YCkucnVuKHNlc3Npb24uaWQpO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWxldGVfZXhwaXJlZF9zZXNzaW9ucyA9IGFzeW5jICgpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuICAgICAgICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgZGF0YWJhc2UucHJlcGFyZShgREVMRVRFIEZST00gc2Vzc2lvbnNfY29udGVudHMgV0hFUkUgZXhwaXJlc19hdCA8ID9gKS5ydW4odGltZSk7XG4gICAgICAgIGRhdGFiYXNlLnByZXBhcmUoYERFTEVURSBGUk9NIHNlc3Npb25zIFdIRVJFIGV4cGlyZXNfYXQgPCA/YCkucnVuKHRpbWUpO1xuXG4gICAgICAgIHJlc29sdmUoKTtcbiAgICB9KTtcbn0iLCJpbXBvcnQgeyBEYXRhYmFzZVNlc3Npb25GaWxlIH0gZnJvbSBcIi4vdXRpbHMvZGJtb2RlbHNcIjtcblxuaW50ZXJmYWNlIFNlc3Npb25EVE8ge1xuICAgIGlkOiBzdHJpbmcsXG4gICAgYXV0aG9yPzogc3RyaW5nLFxuICAgIG1vZHVsZXM6IFJlY29yZDxzdHJpbmcsIE1vZHVsZURUTz4sXG4gICAgZmlsZXM6IERhdGFiYXNlU2Vzc2lvbkZpbGVbXSxcbiAgICBsYXN0X21vZGlmaWVkOiBudW1iZXIsXG4gICAgZXhwaXJlc19hdDogbnVtYmVyLFxufTtcblxuaW50ZXJmYWNlIE1vZHVsZURUTyB7XG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGZ1bmN0aW9uczogRnVuY3Rpb25EVE9bXSxcbn1cblxuaW50ZXJmYWNlIEZ1bmN0aW9uRFRPIHtcbiAgICBtb2R1bGU6IHN0cmluZyB8IG51bGwsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHJldHVybl90eXBlOiBzdHJpbmcsXG4gICAgcGFyYW1ldGVyX3R5cGVzOiBzdHJpbmdbXSxcbiAgICBjb21wbGV0aW9uOiBzdHJpbmcsXG59XG5cbmNvbnN0IGRlbW9Db2RlID0gYFxuaW1wb3J0IGJvdDtcblxuaW50IG1haW4oKSB7XG4gICBib3QuY2hhdChcIkhlbGxvIFdvcmxkIVwiKTtcbiAgIHJldHVybiAwO1xufVxuYC50cmltKCk7XG5cbmV4cG9ydCBjb25zdCBkZW1vU2Vzc2lvbjogU2Vzc2lvbkRUTyA9IHtcbiAgICBpZDogXCJkZW1vXCIsXG4gICAgYXV0aG9yOiBcIkRlbW9cIixcbiAgICBtb2R1bGVzOiB7XG4gICAgICAgIGJvdDoge1xuICAgICAgICAgICAgbmFtZTogXCJib3RcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uczogW1xuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcImNoYXRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwiY2hhdCgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiZGVwb3NpdF9pdGVtXCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJzdHJpbmdcIiBdLCBjb21wbGV0aW9uOiBcImRlcG9zaXRfaXRlbSgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiZ2V0X2Jsb2NrXCIsIHJldHVybl90eXBlOiBcInN0cmluZ1wiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJzdHJpbmdcIiBdLCBjb21wbGV0aW9uOiBcImdldF9ibG9jaygkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiZ2V0X2RpcmVjdGlvblwiLCByZXR1cm5fdHlwZTogXCJzdHJpbmdcIiwgcGFyYW1ldGVyX3R5cGVzOiBbXSwgY29tcGxldGlvbjogXCJnZXRfZGlyZWN0aW9uKCkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwiZ2V0X2l0ZW1cIiwgcmV0dXJuX3R5cGU6IFwic3RyaW5nXCIsIHBhcmFtZXRlcl90eXBlczogW10sIGNvbXBsZXRpb246IFwiZ2V0X2l0ZW0oKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJnZXRfc2VsZWN0ZWRfc2xvdFwiLCByZXR1cm5fdHlwZTogXCJudW1iZXJcIiwgcGFyYW1ldGVyX3R5cGVzOiBbXSwgY29tcGxldGlvbjogXCJnZXRfc2VsZWN0ZWRfc2xvdCgpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcIm1vdmVcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwibW92ZSgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwicHJpbnRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwicHJpbnQoJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcInJvdGF0ZV9sZWZ0XCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFtdLCBjb21wbGV0aW9uOiBcInJvdGF0ZV9sZWZ0KCkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwiYm90XCIsIG5hbWU6IFwicm90YXRlX3JpZ2h0XCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFtdLCBjb21wbGV0aW9uOiBcInJvdGF0ZV9yaWdodCgpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcImJvdFwiLCBuYW1lOiBcInNlbGVjdF9zbG90XCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJpbnRcIiBdLCBjb21wbGV0aW9uOiBcInNlbGVjdF9zbG90KCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJib3RcIiwgbmFtZTogXCJzZXRfc3RhdHVzXCIsIHJldHVybl90eXBlOiBcImludFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJzdHJpbmdcIiwgXCJpbnRcIiBdLCBjb21wbGV0aW9uOiBcInNldF9zdGF0dXMoJDEsICQyKSQwXCIgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgbWF0aDoge1xuICAgICAgICAgICAgbmFtZTogXCJtYXRoXCIsXG4gICAgICAgICAgICBmdW5jdGlvbnM6IFtcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwiY2VpbFwiLCByZXR1cm5fdHlwZTogXCJmbG9hdFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJmbG9hdFwiIF0sIGNvbXBsZXRpb246IFwiY2VpbCgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IFwibWF0aFwiLCBuYW1lOiBcImNvc1wiLCByZXR1cm5fdHlwZTogXCJmbG9hdFwiLCBwYXJhbWV0ZXJfdHlwZXM6IFsgXCJmbG9hdFwiIF0sIGNvbXBsZXRpb246IFwiY29zKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwiZmxvb3JcIiwgcmV0dXJuX3R5cGU6IFwiZmxvYXRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwiZmxvYXRcIiBdLCBjb21wbGV0aW9uOiBcImZsb29yKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwicm91bmRcIiwgcmV0dXJuX3R5cGU6IFwiZmxvYXRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwiZmxvYXRcIiBdLCBjb21wbGV0aW9uOiBcInJvdW5kKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogXCJtYXRoXCIsIG5hbWU6IFwic2luXCIsIHJldHVybl90eXBlOiBcImZsb2F0XCIsIHBhcmFtZXRlcl90eXBlczogWyBcImZsb2F0XCIgXSwgY29tcGxldGlvbjogXCJzaW4oJDEpJDBcIiB9LFxuICAgICAgICAgICAgICAgIHsgbW9kdWxlOiBcIm1hdGhcIiwgbmFtZTogXCJzcXJ0XCIsIHJldHVybl90eXBlOiBcImZsb2F0XCIsIHBhcmFtZXRlcl90eXBlczogWyBcImZsb2F0XCIgXSwgY29tcGxldGlvbjogXCJzcXJ0KCQxKSQwXCIgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgbGFuZzoge1xuICAgICAgICAgICAgbmFtZTogXCJsYW5nXCIsXG4gICAgICAgICAgICBmdW5jdGlvbnM6IFtcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJzdHJsZW5cIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwic3RybGVuKCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJpc19pbnRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwiaXNfaW50KCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJ0b19pbnRcIiwgcmV0dXJuX3R5cGU6IFwiaW50XCIsIHBhcmFtZXRlcl90eXBlczogWyBcInN0cmluZ1wiIF0sIGNvbXBsZXRpb246IFwidG9faW50KCQxKSQwXCIgfSxcbiAgICAgICAgICAgICAgICB7IG1vZHVsZTogbnVsbCwgbmFtZTogXCJpc19mbG9hdFwiLCByZXR1cm5fdHlwZTogXCJpbnRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJpc19mbG9hdCgkMSkkMFwiIH0sXG4gICAgICAgICAgICAgICAgeyBtb2R1bGU6IG51bGwsIG5hbWU6IFwidG9fZmxvYXRcIiwgcmV0dXJuX3R5cGU6IFwiZmxvYXRcIiwgcGFyYW1ldGVyX3R5cGVzOiBbIFwic3RyaW5nXCIgXSwgY29tcGxldGlvbjogXCJ0b19mbG9hdCgkMSkkMFwiIH0sXG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICB9LFxuICAgIGZpbGVzOiBbeyBpZDogXCJtYWluLmNic1wiLCBuYW1lOiBcIm1haW4uY2JzXCIsIGxhc3RfbW9kaWZpZWQ6IERhdGUubm93KCksIGNvbnRlbnQ6IGRlbW9Db2RlIH1dLFxuICAgIGxhc3RfbW9kaWZpZWQ6IDAsXG4gICAgZXhwaXJlc19hdDogMCxcbn07IiwiaW1wb3J0IHsgQXBwbGljYXRpb24gfSBmcm9tIFwiZXhwcmVzc1wiO1xuaW1wb3J0IHsgaGFuZGxlU2VydmVyQ3JlYXRlIH0gZnJvbSBcIi4vY29udHJvbGxlcnMvc2VydmVyLWNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IGhhbmRsZURlbW9TZXNzaW9uR2V0LCBoYW5kbGVEZW1vU2Vzc2lvblN0YXR1c0dldCwgaGFuZGxlU2Vzc2lvbkNyZWF0ZSwgaGFuZGxlU2Vzc2lvbkRlbGV0ZSwgaGFuZGxlU2Vzc2lvbkdldCwgaGFuZGxlU2Vzc2lvblN0YXR1c0dldCwgaGFuZGxlU2Vzc2lvblVwZGF0ZSB9IGZyb20gXCIuL2NvbnRyb2xsZXJzL3Nlc3Npb24tY29udHJvbGxlclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBSb3V0ZXMoZXhwcmVzczogQXBwbGljYXRpb24pIHtcblxuICAgIGV4cHJlc3MucG9zdChcIi9hcGkvc2VydmVyc1wiLCBoYW5kbGVTZXJ2ZXJDcmVhdGUpO1xuXG4gICAgZXhwcmVzcy5wb3N0KFwiL2FwaS9zZXNzaW9uc1wiLCBoYW5kbGVTZXNzaW9uQ3JlYXRlKTtcbiAgICBleHByZXNzLmdldChcIi9hcGkvc2Vzc2lvbnMvZGVtb1wiLCBoYW5kbGVEZW1vU2Vzc2lvbkdldCk7XG4gICAgZXhwcmVzcy5nZXQoXCIvYXBpL3Nlc3Npb25zLzpzZXNzaW9uSWRcIiwgaGFuZGxlU2Vzc2lvbkdldCk7XG4gICAgZXhwcmVzcy5nZXQoXCIvYXBpL3Nlc3Npb25zL2RlbW8vc3RhdHVzXCIsIGhhbmRsZURlbW9TZXNzaW9uU3RhdHVzR2V0KVxuICAgIGV4cHJlc3MuZ2V0KFwiL2FwaS9zZXNzaW9ucy86c2Vzc2lvbklkL3N0YXR1c1wiLCBoYW5kbGVTZXNzaW9uU3RhdHVzR2V0KTtcbiAgICBleHByZXNzLnB1dChcIi9hcGkvc2Vzc2lvbnMvOnNlc3Npb25JZFwiLCBoYW5kbGVTZXNzaW9uVXBkYXRlKTtcbiAgICBleHByZXNzLmRlbGV0ZShcIi9hcGkvc2Vzc2lvbnMvOnNlc3Npb25JZFwiLCBoYW5kbGVTZXNzaW9uRGVsZXRlKTtcblxufSIsImltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRva2VuPFQgZXh0ZW5kcyBvYmplY3Q+KHBheWxvYWQ6IFQsIHRpbWVWYWxpZDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIGp3dC5zaWduKHBheWxvYWQsIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgYXMgc3RyaW5nLCB7XG4gICAgICAgIGV4cGlyZXNJbjogRGF0ZS5ub3coKSArIHRpbWVWYWxpZFxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5VG9rZW48VCBleHRlbmRzIG9iamVjdD4odG9rZW46IHN0cmluZyk6IFQgfCBudWxsIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gand0LnZlcmlmeSh0b2tlbiwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCBhcyBzdHJpbmcpIGFzIFQ7XG4gICAgfSBjYXRjaCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVmVyc2lvbiB7XG4gICAgXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTFBIQTogbnVtYmVyID0gMDtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJFVEE6IG51bWJlciA9IDE7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBSRUxFQVNFOiBudW1iZXIgPSAyNTU7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVkVSU0lPTl9SRUdFWDogUmVnRXhwID0gL15cXGQrKFxcLlxcZCspKlthYl0/JC87XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBJTlZBTElEOiBWZXJzaW9uID0gbmV3IFZlcnNpb24oW10sIFZlcnNpb24uQUxQSEEpO1xuXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBWXzBfNV8xX01VTFRJUExFX0ZJTEVTX0VESVRJTkcgPSBWZXJzaW9uLmZyb20oXCIwLjUuMVwiKTtcbiAgICBcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNlZ21lbnRzOiBudW1iZXJbXTtcbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hhbm5lbDogbnVtYmVyO1xuICAgIHB1YmxpYyByZWFkb25seSBzdHJpbmdpZmllZDogc3RyaW5nO1xuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihzZWdtZW50czogbnVtYmVyW10sIGNoYW5uZWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLnNlZ21lbnRzID0gc2VnbWVudHM7XG4gICAgICAgIHRoaXMuY2hhbm5lbCA9IGNoYW5uZWw7XG4gICAgICAgIHRoaXMuc3RyaW5naWZpZWQgPSBzZWdtZW50cy5qb2luKFwiLlwiKSArIFZlcnNpb24uZ2V0Q2hhbm5lbENoYXIoY2hhbm5lbCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBmcm9tKGlucHV0OiBzdHJpbmcpOiBWZXJzaW9uIHtcbiAgICAgICAgaWYgKCFWZXJzaW9uLlZFUlNJT05fUkVHRVgudGVzdChpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBWZXJzaW9uLklOVkFMSUQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoYW5uZWw6IG51bWJlcjtcbiAgICAgICAgaWYgKGlucHV0LmVuZHNXaXRoKFwiYVwiKSB8fCBpbnB1dC5lbmRzV2l0aChcImJcIikpIHtcbiAgICAgICAgICAgIGNoYW5uZWwgPSBpbnB1dC5lbmRzV2l0aChcImFcIikgPyBWZXJzaW9uLkFMUEhBIDogVmVyc2lvbi5CRVRBO1xuICAgICAgICAgICAgaW5wdXQgPSBpbnB1dC5zbGljZSgwLCAtMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGFubmVsID0gVmVyc2lvbi5SRUxFQVNFO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmF3U2VnbWVudHMgPSBpbnB1dC5pbmNsdWRlcyhcIi5cIikgPyBpbnB1dC5zcGxpdChcIi5cIikgOiBbaW5wdXRdO1xuICAgICAgICBjb25zdCBzZWdtZW50cyA9IHJhd1NlZ21lbnRzLm1hcChWZXJzaW9uLnRvU2VnbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBWZXJzaW9uKHNlZ21lbnRzLCBjaGFubmVsKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyB0b1NlZ21lbnQoaW5wdXQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChpbnB1dCwgMTApO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc1ZhbGlkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcyAhPT0gVmVyc2lvbi5JTlZBTElEO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc09sZGVyVGhhbih2ZXJzaW9uOiBWZXJzaW9uKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmUodmVyc2lvbikgPCAwO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc05ld2VyVGhhbih2ZXJzaW9uOiBWZXJzaW9uKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmUodmVyc2lvbikgPiAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29tcGFyZSh2ZXJzaW9uOiBWZXJzaW9uKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMgPT09IFZlcnNpb24uSU5WQUxJRCkgcmV0dXJuIC0xO1xuICAgICAgICBpZiAodmVyc2lvbiA9PT0gVmVyc2lvbi5JTlZBTElEKSByZXR1cm4gMTtcblxuICAgICAgICBjb25zdCBtaW5MZW5ndGggPSBNYXRoLm1pbih0aGlzLnNlZ21lbnRzLmxlbmd0aCwgdmVyc2lvbi5zZWdtZW50cy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbkxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWdtZW50c1tpXSA8IHZlcnNpb24uc2VnbWVudHNbaV0pIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlZ21lbnRzW2ldID4gdmVyc2lvbi5zZWdtZW50c1tpXSkgcmV0dXJuIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zZWdtZW50cy5sZW5ndGggPT09IHZlcnNpb24uc2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gVmVyc2lvbi5jb21wYXJlQ2hhbm5lbCh0aGlzLmNoYW5uZWwsIHZlcnNpb24uY2hhbm5lbCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBncmVhdGVyU2VnbWVudCA9IHRoaXMuc2VnbWVudHMubGVuZ3RoID09PSBtaW5MZW5ndGggPyB2ZXJzaW9uLnNlZ21lbnRzIDogdGhpcy5zZWdtZW50cztcbiAgICAgICAgZm9yIChsZXQgaSA9IG1pbkxlbmd0aDsgaSA8IGdyZWF0ZXJTZWdtZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZ3JlYXRlclNlZ21lbnRbaV0gIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ3JlYXRlclNlZ21lbnQgPT09IHRoaXMuc2VnbWVudHMgPyAxIDogLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gVmVyc2lvbi5jb21wYXJlQ2hhbm5lbCh0aGlzLmNoYW5uZWwsIHZlcnNpb24uY2hhbm5lbCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgY29tcGFyZUNoYW5uZWwoY2gxOiBudW1iZXIsIGNoMjogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIGNoMSAtIGNoMjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRDaGFubmVsQ2hhcihjaGFubmVsOiBudW1iZXIpOiBzdHJpbmcge1xuICAgICAgICBzd2l0Y2ggKGNoYW5uZWwpIHtcbiAgICAgICAgICAgIGNhc2UgVmVyc2lvbi5BTFBIQTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJhXCI7XG4gICAgICAgICAgICBjYXNlIFZlcnNpb24uQkVUQTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJiXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxufSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJldHRlci1zcWxpdGUzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvb2tpZS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRpZiAoIShtb2R1bGVJZCBpbiBfX3dlYnBhY2tfbW9kdWxlc19fKSkge1xuXHRcdGRlbGV0ZSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9