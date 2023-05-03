const {register, endGame, playerPlay, EndState, getBoard} = require("../modules/ttt");
const {payloadIsJSON, tokenValid} = require("../modules/checker");
const {getSafeNumberField, getToken} = require("../modules/utils");
const {jecnaAuthRequest} = require("../modules/http");
const {ServerException} = require("../exceptions/server/serverException");
const {constants} = require("../modules/constants");
const path = require("path");
const fs = require("fs");
module.exports = {
    trace: async (req, res, next) => {
        res.status(418).send("You found an easter egg!");
        next();
    },
    subscribe: async (req, res, next) => {
        if (!constants.ttt.enable) {
            sendError(res, "SUBSCRIBE /");
            next();
            return;
        }

        const token = getToken(req, true);
        const baseRes = await jecnaAuthRequest("/", token);
        tokenValid(baseRes.data);

        res.status(418).send(register());
        next();
    },
    patch: (req, res, next) => {
        if (!constants.ttt.enable) {
            sendError(res, "PATCH /");
            next();
            return;
        }

        payloadIsJSON(req.headers);

        const token = getToken(req, true);
        const move = getSafeNumberField(req.body?.move, "move");

        const response = playerPlay(token, move);
        if (response instanceof EndState) {
            let message;

            if (response.equals(EndState.DRAW)) message = "You drawed!";
            else if (response.equals(EndState.WIN)) message = "You lost!";
            else if (response.equals(EndState.LOSS)) message = "You won!";
            else throw new ServerException("Tic Tac Toe error :(");

            res.status(418).send(message);
        } else res.status(418).send(response.toString());
        next();
    },
    delete: (req, res, next) => {
        if (!constants.ttt.enable) {
            sendError(res, "DELETE /");
            next();
            return;
        }

        const token = getToken(req, true);
        endGame(token);
        res.status(418).send();
        next();
    },
    options: (req, res, next) => {
        if (!constants.ttt.enable) {
            sendError(res, "OPTIONS /");
            next();
            return;
        }

        const token = getToken(req, true);
        res.status(418).json({
            state: getBoard(token)
        });

        next();
    },
    get: (req, res, next) => {
        if (req.body.githubRedir === "true")
            res.status(200).sendFile(`${__dirname}/../static/notapi.html`, (err) => {
                if (err) next(err);
                else next();
            });
        else {
            res.redirect(302, constants.repo);
            next();
        }
    }
};

function sendError(res, text) {
    res.status(404).send(fs.readFileSync(`${__dirname}/../static/error.html`, "utf-8").replaceAll("{{variable}}", text));
}