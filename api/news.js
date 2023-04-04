const {authRequest} = require("../modules/http");
const newsParser = require("../parsers/newsParser");

module.exports = {
    post: async (req, res) => {
        /*
        Endpoint for getting news.
        Request must contain json body containing token you received from /login and an optional boolean value that states, if everything from archive should be returned.
        {
            "token" : "token",
            "archive" : true/false // default = false,
            "max": maximum-number-of-events, // only for archive
            "index": index-to-start-from // only for archive
        }
        Request will return json containing the list of all news in this format:
        {
            "news": [
                {
                    "title": "titulek",
                    "content": "raw html kontent (i s <p> elementem)",
                    "author": "cele jmeno autora",
                    "date": "datum postu",
                    "public": true/false // jestli je to i pro verejnost nebo jen pro skolu,
                    "attachments": [
                        "url prvniho attachmentu...",
                        "url druheho attachmentu..."
                    ]
                }
            ]
        }
         */

        // sets archive
        const archive = req.body.archive === undefined ? false : req.body.archive;

        // sets index and max
        const max = req.body.max === undefined ? Infinity : Number(req.body.max);
        if (isNaN(max)) {
            res.status(400).send("Max must be number!");
            return;
        }
        const index = req.body.index === undefined ? 0 : Number(req.body.index);
        if (isNaN(index)) {
            res.status(400).send("Max must be number!");
            return;
        }

        // contains archive or the main news
        const resNews = archive ? await authRequest("/akce/archiv", req.body.token) : await authRequest("/akce", req.body.token);

        try {
            const newsJSON = archive ? await newsParser.archive(resNews.data, req.body.token, max, index) : newsParser.normal(resNews.data);
            res.status(200).send(JSON.stringify(newsJSON));
        }
        catch (ex) {
            console.log(ex);
            if (ex.isParserException) res.status(400).send(ex.message);
            else res.status(500); // FIXME it's just temporarily
        }
    }
};