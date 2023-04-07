module.exports = {
    trace: async (req, res) => {
        res.status(418).send("You found an easter egg!");
    }
}