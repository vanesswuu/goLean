const runLog = require('../models/runLog');
const Notification = require('../models/Notification');
const { calculateStreak, isStreakMilestone } = require('../utils/streakHelper');


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

        let streak = 0;
        const notifications = [];

        try {

            //get all previous runs
            const allRuns = await runLog.find({
                user: req.user.id
            })
            const previousRuns = await allRuns.filter(
                r => !r._id.equals(createdLog._id)
            );

            // 1. longest distance pr
            const isLongest = previousRuns.length === 0 || previousRuns.every(r => distance > r.distance);

            if (isLongest) {
                const existing = await Notification.findOne({
                    user: req.user.id,
                    type: 'run_distance',
                    mileStone: distance
                })

                if (!existing) {

                    const notif = new Notification({
                        user: req.user.id,
                        type: 'run_distance',
                        mileStone: distance,
                        title: 'Longest Run!',
                        body: `New personal record, you ran ${distance.toFixed(2)} km!`,
                    });

                    await notif.save();
                    notifications.push({
                        title: notif.title,
                        body: notif.body
                    });

                }
            }

            // 2. fastest speed pr
            const isFastest = previousRuns.length === 0 || previousRuns.every(r => speed > r.speed);

            if (isFastest) {

                const existing = await Notification.findOne({
                    user: req.user.id,
                    type: 'run_speed',
                    mileStone: speed,
                });

                if (!existing) {
                    const notif = new Notification({
                        user: req.user.id,
                        type: 'run_speed',
                        mileStone: speed,
                        title: 'Fastest Run!',
                        body: `New top speed, you averaged ${speed.toFixed(2)} km/h!`,
                    });
                    await notif.save();
                    notifications.push({
                        title: notif.title,
                        body: notif.body
                    });
                }

            }

            // 3. run day streak
            const mapped = allRuns.map(r => ({ dateString: r.date }));
            streak = calculateStreak(mapped, date);

            if (streak > 0 && isStreakMilestone(streak)) {

                const existing = await Notification.findOne({
                    user: req.user.id,
                    type: 'run_streak',
                    mileStone: streak,
                });

                if (!existing) {
                    const notif = new Notification({
                        user: req.user.id,
                        type: 'run_streak',
                        mileStone: streak,
                        title: `🔥 ${streak}-Day Run Streak!`,
                        body: `You've run ${streak} days in a row. Keep it up!`,
                    });
                    await notif.save();
                    notifications.push({ title: notif.title, body: notif.body });
                }

            }

        } catch (milestoneError) {
            console.error('Error calculating run milestone notifications:', milestoneError);
        }

        res.status(201).json({ log: createdLog, streak, notifications })


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

