// noinspection JSUnresolvedReference

const express = require("express");
const fs = require("fs");
const {getContentType} = require("./utils");
const {constants} = require("./constants");
const {JecnaException} = require("../exceptions/jecnaException");
const {ClientException} = require("../exceptions/client/clientException");

const LOG_MESSAGE_SEPARATOR_LENGTH = 150;

const LOG_MESSAGE_TEMPLATE = {
    title: (req) => {
        const titleText = ` EXCHANGE #${req.logger.id} `;
        const separators = getSeparator(LOG_MESSAGE_SEPARATOR_LENGTH, titleText.length, "=");
        return `${separators}${titleText}${separators}`;
    },
    /**
     * @param req{express.Request}
     */
    basicInfo: (req) => {
        return `\nTime: ${getTime()}\nIP: ${req.logger.ip}\nMethod: ${req.method}\nPath: ${req.path}\n`;
    },
    /**
     * @param req{express.Request}
     */
    request: (req) => {
        const text = `\nHeaders:\n${JSON.stringify(req.headers, null, 2)}\nData:\n${JSON.stringify(req.body, null, 2) ?? "none"}\n`;
        const maxLineLength = Math.max(...text.split("\n").map(a=>a.length));
        const titleText = " REQUEST ";
        const separators = getSeparator(maxLineLength, titleText.length);
        return `\n${separators}${titleText}${separators}${text}`;
    },
    /**
     * @param req{express.Request}
     */
    response: (req) => {
        const text = `\nHeaders:\n${JSON.stringify(req.res.getHeaders(), null, 2)}\nData:\n${JSON.stringify(req.logger.resData, null, 2) ?? "none"}\n`;
        const maxLineLength = Math.max(...text.split("\n").map(a=>a.length));
        const titleText = " RESPONSE ";
        const separators = getSeparator(maxLineLength, titleText.length);
        return `\n${separators}${titleText}${separators}${text}`;
    },
    /**
     * @param req{express.Request}
     */
    files: (req) => {
        const getFileText = (fileObject) => {
            const fObject = {...fileObject};
            fObject.type = fObject.buffer === undefined ? "file" : "memory";
            fObject.buffer = undefined;
            return `\n${JSON.stringify(fObject, null, 2)}`;
        };
        if (req.file === undefined && req.files === undefined) return "";
        let text = "";
        if (req.file !== undefined) text = getFileText(req.file);
        else req.files.forEach(file => text += getFileText(file));

        const maxLineLength = Math.max(...text.split("\n").map(a=>a.length));
        const titleText = " FILES ";
        const separators = getSeparator(maxLineLength, titleText.length);
        return `\n${separators}${titleText}${separators}${text}\n`;
    },
    completedMessage: (req) => {
        const text = `Completed after ${req.logger.time}ms with ${req.res.statusCode} ${req.res.statusMessage}`;
        return `${"-".repeat(text.length)}\n${text}\n`;
    },
    exception: (req) => {
        if (req.logger.err === undefined) return "";
        let text = `\nType: ${req.logger.err.name}\nMessage: ${req.logger.err.message}\n`;
        if (!(req.logger.err instanceof JecnaException)) text += `${req.logger.err.stack}\n`;

        const maxLineLength = Math.max(...text.split("\n").map(a=>a.length));
        const titleText = " EXCEPTION ";
        const separators = getSeparator(maxLineLength, titleText.length);
        return `${separators}${titleText}${separators}${text}`;
    },
    exitMessage: (req) => {
        if (req.logger.err?.exitCode === undefined) return "";
        const text = `Process finished with exit code ${req.logger.err.exitCode.toString()}.`;
        return `${"-".repeat(text.length)}\n${text}\n`
    }
};
const LOG_MESSAGE_CONSOLE_EXCHANGE_TEMPLATE =
    `[#{id}] [{ip}] [{method} {path}] [{req.contentType}] - {res.code} {res.codeName} after {res.time}ms{misc}`;
const LOG_MESSAGE_CONSOLE_TEMPLATE =
    `[{time}] [{type}] {message}`;

let id;

class oldConsole {
    static log = console.log;
    static error = console.error;
    static info = console.info;
    static warn = console.warn;
    static debug = console.debug;
}
/**
 * Initializes the logger to change some console methods
 */
function loggerInit() {
    console.log = giveConsoleLog(oldConsole.log, "LOG");
    console.error = giveConsoleLog(oldConsole.error, "ERROR");
    console.info = giveConsoleLog(oldConsole.info, "INFO");
    console.warn = giveConsoleLog(oldConsole.warn, "WARNING");
    console.debug = giveConsoleLog(oldConsole.debug, "DEBUG");

    /**
     * @type{function (Error): void}
     */
    console.except = consoleExcept;

    if (fs.existsSync(constants.logs.logsFolder) && !fs.statSync(constants.logs.logsFolder).isDirectory())
        fs.unlinkSync(constants.logs.logsFolder);
    if (!fs.existsSync(constants.logs.logsFolder))
        fs.mkdirSync(constants.logs.logsFolder);

    // init counter file
    if (!fs.existsSync(constants.logs.counterFile))
        fs.writeFileSync(constants.logs.counterFile, "0", "utf-8");

    id = parseInt(fs.readFileSync(constants.logs.counterFile, "utf-8"));
}

function getTime() {
    return new Date().toLocaleTimeString("cs");
}

/**
 * @param req{express.Request}
 */
async function logExchange(req) {
    /*
    Req.logger
        id : number
        time : string
        ip : string
        err : Error | undefined
            + exitCode : number | undefined
     */

    // LOG TO CONSOLE
    let contentType;
    try {
        contentType = getContentType(req.headers)
    }
    catch (ex) {
        if (ex instanceof ClientException) contentType = "none";
        else throw ex;
    }
    console.log(LOG_MESSAGE_CONSOLE_EXCHANGE_TEMPLATE
            .replaceAll("{id}", req.logger.id)
            .replaceAll("{ip}", req.logger.ip)
            .replaceAll("{method}", req.method)
            .replaceAll("{path}", req.path)
            .replaceAll("{req.contentType}", contentType)
            .replaceAll("{res.code}", req.res.statusCode.toString())
            .replaceAll("{res.codeName}", req.res.statusMessage)
            .replaceAll("{res.time}", req.logger.time)
            .replaceAll("{misc}", req.logger.err === undefined ? "" : ` with ${req.logger.err.name}${req.logger.err instanceof JecnaException ? "Exception": ""}: ${req.logger.err.message}`)
    , "EXCHANGE");
    if (req.logger.err?.exitCode !== undefined) oldConsole.log(req.logger.err.stack);

    // WRITE TO FILE
    // get filename
    const date = new Date();
    const filename = `${constants.logs.logsFolder}/${date.getDay()}-${date.getMonth()}-${date.getFullYear()}-log.txt`;
    if (!fs.existsSync(filename)) fs.unlinkSync(constants.logs.counterFile);
    // write

    fs.appendFileSync(filename,
        LOG_MESSAGE_TEMPLATE.title(req) +
        LOG_MESSAGE_TEMPLATE.basicInfo(req) +
        LOG_MESSAGE_TEMPLATE.request(req) +
        LOG_MESSAGE_TEMPLATE.files(req) +
        LOG_MESSAGE_TEMPLATE.response(req) +
        LOG_MESSAGE_TEMPLATE.completedMessage(req) +
        LOG_MESSAGE_TEMPLATE.exception(req) +
        LOG_MESSAGE_TEMPLATE.exitMessage(req)
    );

    // IF UNRESOLVED EXIT
    if (req.logger.err?.exitCode !== undefined) {
        console.error(`Exited with code ${req.logger.err.exitCode}.`);
        process.exit(req.logger.err.exitCode);
    }
}

function loggerStartMiddleware(req, res, next) {
    // set all the variables
    req.logger = {
        id: id++,
        ip: req.socket.remoteAddress,
        time: performance.now(),
        chunks: []
    };
    // override write and end methods
    const oldJson = res.json;
    const oldSend = res.send;

    res.json = function (obj) {
        req.logger.resData = obj;
        oldJson.apply(this, arguments);
    };
    res.send = function (body) {
        if (req.logger.resData === undefined)
            req.logger.resData = body;
        oldSend.apply(this, arguments);
    };

    next();
}
function loggerEndMiddleware(req, res, next) {
    // set other variables
    req.logger.time = (performance.now() - req.logger.time).toFixed(2);

    logExchange(req).then();

    // sync id
    fs.writeFileSync(constants.logs.counterFile, id.toString(), "utf-8");

    next();
}

// #############################

function giveConsoleLog(clog, _type) {
    return (message, type = _type) => {
        clog(LOG_MESSAGE_CONSOLE_TEMPLATE
            .replaceAll("{time}", getTime())
            .replaceAll("{type}", type)
            .replaceAll("{message}", message)
        );
    };
}

/**
 * @param maxLineLength{number}
 * @param titleTextLength{number}
 * @param char{string}
 */
function getSeparator(maxLineLength, titleTextLength, char = "-") {
    if (maxLineLength > LOG_MESSAGE_SEPARATOR_LENGTH) maxLineLength = LOG_MESSAGE_SEPARATOR_LENGTH;
    let count = (maxLineLength - titleTextLength) / 2;
    if (count < titleTextLength) count++;
    return count < 0 ? "" : char.repeat(count);
}

/**
 *
 * @param err{Error}
 */
function consoleExcept(err) {
    console.error(`${err.name}: ${err.message}`);
    oldConsole.log(err.stack);
    process.exit(1);
}

module.exports = {
    loggerInit,
    loggerStartMiddleware,
    loggerEndMiddleware,
    oldConsole
}