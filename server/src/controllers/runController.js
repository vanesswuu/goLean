const runLog = require('../models/runLog');

// @desc save a run
// @route POST /api/runs
// @access Private

const saveRun = async (req, res, next) => {

    try {

        const { distance, timeElapsed, speed, date } = req.body;

        const log = new runLog({

            user: req.user.id,
            distance,
            timeElapsed,
            speed,
            date

        });

        const createdLog = await log.save();
        res.status(201).json({ log })


    } catch (error) {
        next(error);
    }




};


// @desc save a run
// @route GET /api/runs
// @access Private

const getRuns = async (req, res, next) => {

    try {
        const runs = await runLog.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(runs);
    } catch (error) {
        next(error);
    }


}

module.exports = { getRuns, saveRun };

