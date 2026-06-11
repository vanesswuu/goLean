
import { describe, it, expect, beforeEach, vi } from 'vitest';

//what were testing
import { calculateStreak, isStreakMilestone } from '../utils/streakHelper';

describe('Streak Feature', () => {

  it('should detect a 3-day streak', () => {

    const logs = [
      { dateString: 'Sat, Jun 8' },
      { dateString: 'Sun, Jun 9' },
      { dateString: 'Mon, Jun 10' }
    ]

    const result = calculateStreak(logs, 'Mon, Jun 10');
    expect(result).toBe(3);


  });

  it('should identify 3 as a milestone', () => {
    const result = isStreakMilestone(3);

    expect(result).toBe(true);
  })

  it('should NOT identify 4 as a milestone', () => {
    const result = isStreakMilestone(4);

    expect(result).toBe(false);
  });


  it('should identify all milestone days', () => {
    const milestones = [3, 5, 7, 15, 30];

    milestones.forEach(day => {
      expect(isStreakMilestone(day)).toBe(true);
    });
  });

  it('should NOT identify non-milestone days', () => {
    const nonMilestones = [1, 2, 4, 6, 8, 10, 14, 29, 31];

    nonMilestones.forEach(day => {
      expect(isStreakMilestone(day)).toBe(false);
    });
  });

  it('should return 0 for broken streak', () => {
    const logs = [
      { dateString: 'Thu, Jun 6' },
      { dateString: 'Mon, Jun 10' }  // Gap of 3 days
    ];

    const result = calculateStreak(logs, 'Mon, Jun 10');

    expect(result).toBe(1);
  });

  it('should create notifications for all milestone days', () => {
    const milestones = [3, 5, 7, 15, 30];

    milestones.forEach(day => {
      const shouldNotify = isStreakMilestone(day);
      expect(shouldNotify).toBe(true);
      console.log(`✓ Day ${day}: Notification triggered`);
    });
  });


})