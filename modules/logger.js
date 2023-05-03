const fs = require("fs");
const util = require("util");
const {constants} = require("./constants");
const {getContentType, getToken} = require("./utils");
const {ClientException} = require("../exceptions/client/clientException");
const {JecnaException} = require("../exceptions/jecnaException");
const logger = new class Logger {
    constructor() {
        this.except = this.except.bind(this);
        this.exchange = this.exchange.bind(this);
        this.getTime = this.getTime.bind(this);
        this.setupMiddleware = this.setupMiddleware.bind(this);
        this.startMiddleware = this.startMiddleware.bind(this);
        this.endMiddleware = this.endMiddleware.bind(this);

        this.#fileCheck(constants.logs.logsFolder, true);
        this.#fileCheck(constants.logs.fullLogsFolder, true);
        this.#fileCheck(constants.logs.counterFile, false, "0");

        this.#nextId = parseInt(fs.readFileSync(constants.logs.counterFile, "utf-8"));

        const oldCerror = console.error;
        console.error = function (what) {
            if (!what.toString().includes("ERR_HTTP_HEADERS_SENT")) oldCerror.apply(this, arguments);
        };
    }

    log = this.#giveConsoleLog(console.log, "LOG");
    info = this.#giveConsoleLog(console.info, "INFO");
    error = this.#giveConsoleLog(console.error, "ERROR");
    warn = this.#giveConsoleLog(console.warn, "WARNING");
    debug = this.#giveConsoleLog(console.debug, "DEBUG");

    #nextId;
    #SEPARATOR_LENGTH = 150;

    decrementId() {
        this.#nextId--;
    }

    except(err, exitCode = 1) {
        this.error(`${err.name}: ${err.message}`);
        console.error(err.stack);
        process.exit(exitCode);
    };

    exchange(req) {
        // set content type
        let contentType;
        try {
            contentType = getContentType(req.headers);
        } catch (ex) {
            if (ex instanceof ClientException) contentType = req.query === undefined ? "none" : "query params";
            else throw ex;
        }
        /*
        [#{id}] [{ip}] [{method} {path}] [{req.contentType}] - {res.code} {res.codeName} after {res.startTime}ms ({res.setupTime}ms setup inc.){misc}
         */
        this.log(
            `[#${req.logger.id}] [${req.socket.remoteAddress}] [${req.method} ${req.path}] [${contentType}] - ${req.res.statusCode} ${req.res.statusMessage} ` +
            `after ${req.logger.startTime ?? "??"}ms (${req.logger.setupTime}ms setup inc.)${req.logger.err === undefined ? "" :
                ` with ${req.logger.err.name}${req.logger.err instanceof JecnaException ? "Exception" : ""}: ${req.logger.err.message}`}`,
            "EXCHANGE"
        );
        // if exiting error log stack
        if (req.logger.err?.exitCode !== undefined) this.error(req.logger.err.stack);

        // write to the log
        /*
        {head}
        Time: {time}
        IP: {ip}
        Path: {url}
        Method: {method}
        {title ' REQUEST '}
        Token: {req.token}
        Headers:
        {req.headers}
        {req.dataType}
        {req.data}
        [[files]]
        {files.title}
        {files}
        [[files.end]]
        {title ' RESPONSE '}
        Status: {res.statusCode} {res.statusMessage}
        Headers:
        {res.headers}
        Data:
        {res.data}
        [[exception]]
        {title ' EXCEPTION '}
        Type: {err.type}
        Message: {err.message}
        [[endException]]
        {err.stack}
        [[endException.end]]
        [[exception.end]]
        {separator}
        Completed after:
            {setupTime}ms from setup
            {startTime}ms from start
        [[endException]]
        Process finished with exit code {err.exitCode}.
        [[endException.end]]
         */
        let reqBody;
        let bodyIsRaw = false;
        if (req.logger.bodyType !== undefined) {
            reqBody = {...req.body};
            this.#changeBody(reqBody, req.logger.fullLogFilename);
        } else {
            reqBody = req.logger.rawData;
            bodyIsRaw = true;
        }
        let resBody;
        if (req.logger.resDataJSON) {
            resBody = {...req.logger.resData};
            this.#changeBody(resBody, req.logger.fullLogFilename);
        }

        const reqHeaders = {...req.headers};
        delete reqHeaders.token;

        const filesText = (req) => {
            // if no file return ""
            if (req.file === undefined && req.files === undefined) return "";
            const getFileText = (fileObject) => {
                const fObject = {...fileObject};
                fObject.type = fObject.buffer === undefined ? "file" : "memory";
                delete fObject.buffer;
                return `\n${JSON.stringify(fObject, null, 2)}`;
            };
            // populate the text
            let text = "";
            if (req.file !== undefined) text = getFileText(req.file);
            else req.files.forEach(file => text += getFileText(file));

            return `\n${this.#computeSeparator(" FILES ")}${text}`;
        };

        const log = `${this.#computeSeparator(` EXCHANGE #${req.logger.id} `, this.#SEPARATOR_LENGTH, "=")}
Time: ${this.getTime()}
IP: ${req.socket.remoteAddress}
Path: ${req.path}
Method: ${req.method}
${this.#computeSeparator(" REQUEST ")}
Token: ${getToken(req, false, "none")}
Headers:
${JSON.stringify(reqHeaders, null, 2)}
${req.logger.bodyType ?? "Plain"}:
${bodyIsRaw ? reqBody : JSON.stringify(reqBody, null, 2) ?? "none"}${filesText(req)}
${this.#computeSeparator(" RESPONSE ")}
Status: ${req.res.statusCode} ${req.res.statusMessage}
Headers:
${JSON.stringify(req.res.getHeaders(), null, 2)}
Data:
${req.logger.resDataJSON ? JSON.stringify(resBody, null, 2) ?? "none" : req.logger.resData}${req.logger.err === undefined ? "" : `
${this.#computeSeparator(" EXCEPTION ")}
Type: ${req.logger.err.name}
Message: ${req.logger.err.message}${req.logger.err.exitCode === undefined ? "" : `\n${req.logger.err.stack.substring(req.logger.err.stack.indexOf("\n") + 1)}`}`}
${this.#computeSeparator()}
Completed after:
    ${req.logger.setupTime}ms from setup
    ${req.logger.startTime === undefined ? "Haven't reached start" : `${req.logger.startTime}ms from start`}${req.logger.err?.exitCode === undefined ? "" : `
${this.#computeSeparator()}
Process finished with exit code ${req.logger.err.exitCode}.`}
`;

        fs.appendFileSync(req.logger.logFilename, log, "utf-8");

        // Write a full log
        fs.appendFileSync(req.logger.fullLogFilename, this.#computeSeparator(` EXCHANGE #${req.logger.id}`) + util.inspect(req), "utf-8");
    }

    getTime() {
        return new Date().toLocaleTimeString("cs");
    }

    setupMiddleware(req, res, next) {
        // get files
        const date = new Date();
        const stringDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const logFilename = `${constants.logs.logsFolder}/${stringDate}.log`;
        const fullLogFilename = `${constants.logs.fullLogsFolder}/${stringDate}-full.log`;
        // check if reset counter
        if (!fs.existsSync(logFilename))
            this.#nextId = 0;
        // set the request logger object
        req.logger = {
            setupTimeStart: performance.now(),
            id: this.#nextId++,
            logFilename: logFilename,
            fullLogFilename: fullLogFilename,
            resDataJSON: false
        };
        // write the id to the file
        fs.writeFileSync(constants.logs.counterFile, this.#nextId.toString(), "utf-8");
        // overwrite properties
        const oldJson = res.json;
        const oldSend = res.send;

        res.json = function (obj) {
            if (req.logger !== undefined) {
                req.logger.resData = obj;
                req.logger.resDataJSON = true;
            }
            oldJson.apply(this, arguments);
        };
        res.send = function (body) {
            if (req.logger !== undefined && req.logger.resData === undefined)
                req.logger.resData = body;
            oldSend.apply(this, arguments);
        };

        next();
    }

    startMiddleware(req, res, next) {
        req.logger.startTimeStart = performance.now();
        req.logger.bodyType = req.query === undefined ? "Data" : "Query";

        next();
    }

    endMiddleware(req, res, next) {
        if (req.logger === undefined) return;
        const now = performance.now();
        // stop times
        req.logger.setupTime = (now - req.logger.setupTimeStart).toFixed(2);
        if (req.logger.startTimeStart !== undefined)
            req.logger.startTime = (now - req.logger.startTimeStart).toFixed(2);
        // log the exchange
        this.exchange(req);
        // if end exit
        if (req.logger.err?.exitCode !== undefined)
            process.exit(req.logger.err.exitCode);
        next();
    }

    #giveConsoleLog(method, _type) {
        return (message, type = _type) => {
            method(`[${this.getTime()}] [${type}] ${message}`);
        };
    }

    #fileCheck(file, isFolder, data = "") {
        if (fs.existsSync(file) && (isFolder ^ fs.statSync(file).isDirectory()))
            fs.rmSync(file, {recursive: true, force: true});
        if (!fs.existsSync(file)) {
            if (isFolder) fs.mkdirSync(file);
            else fs.writeFileSync(file, data, "utf-8");
        }
    }

    #computeSeparator(title = "", maxLength = this.#SEPARATOR_LENGTH / 2, separatorChar = "-") {
        const separators = separatorChar.repeat(Math.ceil((maxLength - title.length) / 2));
        return `${separators}${title}${separators}`;
    }

    #changeBody(object, fullLogName) {
        for (const entry of Object.entries(object)) {
            if (typeof (entry[1]) === "object") this.#changeBody(entry[1], fullLogName);
            let length = JSON.stringify(entry[1])?.length;
            if (length === undefined) continue;
            if (length > 20000) object[entry[0]] = `(hidden ${length} characters, see full in ${fullLogName})`;
        }
    }
};

module.exports = logger;