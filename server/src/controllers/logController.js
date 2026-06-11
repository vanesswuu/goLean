const DailyLog = require('../models/DailyLog');
const Notification = require('../models/Notification');
const { calculateStreak ,isStreakMilestone} = require('../utils/streakHelper')





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


        let newMilestone = null;
        let streak = 0;
        //check streak
        try {

            const allLogs = await DailyLog.find({ user: req.user.id });
            streak = calculateStreak(allLogs,dateString);


            if (streak > 0 && isStreakMilestone(streak)) {
                const existingNotif = await Notification.findOne({
                    user: req.user.id,
                    title: 'streak',
                    mileStone: streak,
                });

                if (!existingNotif) {
                    const notif = new Notification({
                        user: req.user.id,
                        type: 'streak',
                        mileStone: streak,
                        title: `🔥 ${streak}-Day Streak!`,
                        body: `You logged your meals ${streak} days in a row. Keep up the amazing work!`
                    });
                    await notif.save();

                    newMilestone = {
                        title: notif.title,
                        body: notif.body,
                        mileStone: streak,
                    };
                }

            }

        } catch (streakError) {
            console.error('Streak notification error:', streakError);
        }

        res.status(201).json({
            log: createdLog,
            streak,
            newMilestone,
        });

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