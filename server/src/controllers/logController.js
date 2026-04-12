const DailyLog = require('../models/DailyLog');


// @desc save a finished day log
// @route POST /api/logs
// @access Private

const saveLog = async (req, res, next) => {

    try {

        const { dateString, totalCals, protein, carbs, fats, meals } = req.body;

        const log = new DailyLog({
            user: req.user.id,
            dateString,
            totalCals,
            protein,
            carbs,
            fats,
            meals
        });

        const createdLog = await log.save();
        res.status(201).json(createdLog);
        
    } catch (error) {
        next(error);
    }

}

// @desc get all daily logs
// @route GET /api/logs
// @access Private

const getLogs = async (req, res, next) => {

    try {

        const logs = await DailyLog.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(logs);


    } catch (error) {
        next(error)
    }
};

module.exports = { saveLog, getLogs };