//calculates the current consecutive logging streak from an array of logs

const calculateStreak = (logs) => {

    if (!logs || logs.length === 0) return 0;

    const dates = Array.from(new Set(logs.map(l => l.dateString)))
        .sort((a, b) => new Date(b) - new Date(a));

    //start streak and get today's date
    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    //get most recent date in dates
    let expectedDate = new Date(dates[0]);
    expectedDate.setHours(0, 0, 0, 0);

    // if the latest log is older than yesterday, the streak is broken
    const diffTime = Math.abs(today - expectedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;

    for (let i = 0; i < dates.length; i++) {
        let currentDate = new Date(dates[i]);
        currentDate.setHours(0, 0, 0, 0);

        if (i === 0) {
            streak = 1;
            expectedDate.setDate(expectedDate.getDate() - 1);
            continue;
        }

        if (currentDate.getTime() === expectedDate.getTime()) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
};

module.exports = { calculateStreak };