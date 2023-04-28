const fs = require("fs");
const {constants} = require("./constants");
const {TokenException} = require("../exceptions/client/tokenException");
const {DataException} = require("../exceptions/client/dataException");

const TOKEN_LENGTH = 15;
const EMPTY_SQUARE = 0;
const BOT_SQUARE = 1;
const PLAYER_SQUARE = 2;

const UNIX_TIME_DAY = 86400;

const WINS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

let database;

function tttInit() {
    if (!constants.ttt.enable) return;

    if (!fs.existsSync(constants.ttt.databaseFile))
        database = {db: []};
    else
        database = JSON.parse(fs.readFileSync(constants.ttt.databaseFile, "utf-8"));

    saveDb();
    removeOld();
}

function saveDb() {
    fs.writeFileSync(constants.ttt.databaseFile, JSON.stringify(database, null, 2), "utf-8");
}

function removeOld() {
    for (const game of database.db.filter(x => Date.now() - x.regTime > UNIX_TIME_DAY * 3))
        database.db.splice(database.db.indexOf(game), 1);
    saveDb();
}

function register() {
    const token = genToken(TOKEN_LENGTH);
    database.db.push({
        token: token,
        board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        regTime: Date.now()
    });
    saveDb();
    return token;
}

function endGame(token) {
    for (const game of database.db.filter(x => x.token === token))
        database.db.splice(database.db.indexOf(game), 1);
    saveDb();
}

function getBoard(token) {
    const board = database.db.find(x => x.token === token)?.board;
    if (board === undefined) throw new TokenException("Invalid token!");
    return board;
}

function playerPlay(token, move) {
    const board = getBoard(token);
    // move validation
    if (move < 0 || move > 8 || board[move] !== EMPTY_SQUARE) throw new DataException("Invalid move!");
    // set the board
    board[move] = PLAYER_SQUARE;
    // eval win or loss
    let eval = boardEval(board);
    if (!isNaN(eval)) {
        endGame(token);
        return new EndState(eval);
    }
    // play
    const bestMove = minimax(board, BOT_SQUARE)[0];
    board[bestMove] = BOT_SQUARE;
    // eval win or loss
    eval = boardEval(board);
    if (!isNaN(eval)) {
        endGame(token);
        return new EndState(eval);
    }
    // save
    saveDb();
    // return
    return bestMove;
}

function boardEval(board) {
    const containsAll = (target, array) => {
        const difference = target.filter(x => !array.includes(x));
        return difference.length === 0;
    };

    const indexes = [];

    board.findIndex((value, index) => {
        if (value === PLAYER_SQUARE) indexes.push(index);
    });
    for (const win of WINS)
        if (containsAll(win, indexes)) return 0;

    indexes.length = 0;

    board.findIndex((value, index) => {
        if (value === BOT_SQUARE) indexes.push(index);
    });
    for (const win of WINS)
        if (containsAll(win, indexes)) return 2;

    if (board.filter(x => x === EMPTY_SQUARE).length === 0) return 1;
    return NaN;
}

function minimax(board, playFor) {
    let eval = boardEval(board);
    if (!isNaN(eval)) return [0, eval];

    eval = [0, playFor === BOT_SQUARE ? -Infinity : Infinity];
    const func = playFor === BOT_SQUARE ? bigger : smaller;

    for (let i = 0; i < board.length; i++) {
        if (board[i] !== EMPTY_SQUARE) continue;
        const boardCopy = [...board];
        boardCopy[i] = playFor;
        const beval = minimax(boardCopy, playFor === PLAYER_SQUARE ? BOT_SQUARE : PLAYER_SQUARE);
        eval = func.apply(null, [eval[1], beval[1]]) ? eval : [i, beval[1]];
    }
    return eval;
}

function bigger(a, b) {
    return a > b;
}

function smaller(a, b) {
    return a < b;
}

function genToken(length) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_*;+-*/!%$#";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

class EndState {
    #num;

    constructor(num) {
        this.#num = num;
    }

    equals(endState) {
        return this.#num === endState.#num;
    }

    static WIN = new EndState(2);
    static DRAW = new EndState(1);
    static LOSS = new EndState(0);
}

module.exports = {
    tttInit,
    register,
    endGame,
    playerPlay,
    getBoard,
    EndState
};