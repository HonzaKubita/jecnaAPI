module.exports = {
    trace: async (req, res, next) => {
        res.status(418).send("You found an easter egg!");
        next();
    }
}