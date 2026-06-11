// calculates the current consecutive logging streak from an array of logs

const MILESTONE_DAYS = [3, 5, 7, 15, 30];


//this sets the time 0 0 0 0, so we are only going to check the dates
const normalizeDate = (dateInput) => {
    const d = new Date(dateInput);
    d.setHours(0, 0, 0, 0);
    return d;
};

// this adds the year to the date if its not existing
const parseLogDate = (dateString, referenceDate = new Date()) => {

    const ref = normalizeDate(referenceDate);
    const refYear = ref.getFullYear();

    // Already has a year e.g. "Sat, Jun 6, 2025"
    if (/\b\d{4}\b/.test(dateString)) {
        return normalizeDate(new Date(dateString));
    }

    // Append current year for strings like "Sat, Jun 6"
    let parsed = normalizeDate(new Date(`${dateString}, ${refYear}`));

    return parsed;
};

//checks how many days in between the most recent log and the food logged today
const daysBetween = (a, b) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round((normalizeDate(a) - normalizeDate(b)) / msPerDay);
};


const calculateStreak = (logs, referenceDate = new Date()) => {

    if (!logs || logs.length === 0) return 0;

    const today = typeof referenceDate === 'string'
        ? parseLogDate(referenceDate, new Date())
        : normalizeDate(referenceDate);

    const dates = Array.from(new Set(logs.map((l) => l.dateString)))
        .sort((a, b) => parseLogDate(b, today) - parseLogDate(a, today));

    const mostRecent = parseLogDate(dates[0], today);

    if (daysBetween(today, mostRecent) > 1) return 0;

    let streak = 0;
    let expectedDate = new Date(mostRecent);

    for (let i = 0; i < dates.length; i++) {
        
        const currentDate = parseLogDate(dates[i], today);

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

//returns a boolean
const isStreakMilestone = (streak) => MILESTONE_DAYS.includes(streak);

module.exports = { calculateStreak, isStreakMilestone, MILESTONE_DAYS };