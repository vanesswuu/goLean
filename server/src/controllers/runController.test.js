import { describe, it, expect } from 'vitest';
import { calculateStreak, isStreakMilestone } from '../utils/streakHelper';

// Pure helper mirrors of the runController logic (no DB needed)
const isLongestRun = (distance, previousRuns) =>
    previousRuns.length === 0 || previousRuns.every(r => distance > r.distance);

const isFastestRun = (speed, previousRuns) =>
    previousRuns.length === 0 || previousRuns.every(r => speed > r.speed);

const getRunStreak = (allRuns, referenceDate) => {
    const mapped = allRuns.map(r => ({ dateString: r.date }));
    return calculateStreak(mapped, referenceDate);
};

// ─── Longest Distance PR ──────────────────────────────────────────────────────

describe('Longest Distance PR', () => {

    it('should flag as longest on first ever run (no previous runs)', () => {
        expect(isLongestRun(5.0, [])).toBe(true);
    });

    it('should flag as longest when distance beats all previous runs', () => {
        const previous = [{ distance: 3.0 }, { distance: 4.5 }];
        expect(isLongestRun(5.0, previous)).toBe(true);
    });

    it('should NOT flag as longest when a previous run is equal', () => {
        const previous = [{ distance: 5.0 }, { distance: 3.0 }];
        expect(isLongestRun(5.0, previous)).toBe(false);
    });

    it('should NOT flag as longest when a previous run is longer', () => {
        const previous = [{ distance: 6.0 }, { distance: 3.0 }];
        expect(isLongestRun(5.0, previous)).toBe(false);
    });

});

// ─── Fastest Speed PR ─────────────────────────────────────────────────────────

describe('Fastest Speed PR', () => {

    it('should flag as fastest on first ever run (no previous runs)', () => {
        expect(isFastestRun(12.5, [])).toBe(true);
    });

    it('should flag as fastest when speed beats all previous runs', () => {
        const previous = [{ speed: 10.0 }, { speed: 11.5 }];
        expect(isFastestRun(12.5, previous)).toBe(true);
    });

    it('should NOT flag as fastest when a previous run is equal', () => {
        const previous = [{ speed: 12.5 }, { speed: 10.0 }];
        expect(isFastestRun(12.5, previous)).toBe(false);
    });

    it('should NOT flag as fastest when a previous run is faster', () => {
        const previous = [{ speed: 14.0 }, { speed: 10.0 }];
        expect(isFastestRun(12.5, previous)).toBe(false);
    });

});

// ─── Run Day Streak ───────────────────────────────────────────────────────────

describe('Run Day Streak', () => {

    it('should return 1 for a single run today', () => {
        const runs = [{ date: 'Mon, Jun 10' }];
        expect(getRunStreak(runs, 'Mon, Jun 10')).toBe(1);
    });

    it('should detect a 3-day run streak', () => {
        const runs = [
            { date: 'Sat, Jun 8' },
            { date: 'Sun, Jun 9' },
            { date: 'Mon, Jun 10' },
        ];
        expect(getRunStreak(runs, 'Mon, Jun 10')).toBe(3);
    });

    it('should return 1 for a broken streak (isolated run today)', () => {
        const runs = [
            { date: 'Thu, Jun 6' },
            { date: 'Mon, Jun 10' }, // 3-day gap
        ];
        expect(getRunStreak(runs, 'Mon, Jun 10')).toBe(1);
    });

    it('should NOT trigger milestone for non-milestone streak (e.g. 2)', () => {
        expect(isStreakMilestone(2)).toBe(false);
    });

    it('should trigger milestone for 3-day streak', () => {
        expect(isStreakMilestone(3)).toBe(true);
    });

    it('should trigger milestones for all run streak milestone days', () => {
        [3, 5, 7, 15, 30].forEach(day => {
            expect(isStreakMilestone(day)).toBe(true);
        });
    });

});
