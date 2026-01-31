import { ScheduleDomain } from "./schedule.domain";

describe('ScheduleDomain', () => {
  let domain: ScheduleDomain;

  beforeEach(() => {
    domain = new ScheduleDomain();
  });

  describe('generateSlots', () => {
    it('Must generate slots respecting the end of the workday', () => {
      const slots = domain.generateSlots('09:00', '10:00', 30);

      expect(slots).toEqual(['09:00', '09:30']);
    });

    it('Should not generate a slot that extends beyond the end of the workday', () => {
      const slots = domain.generateSlots('09:00', '09:50', 30);

      expect(slots).toEqual(["09:00"]);
    });

    it('Should allow for different granularity of duration', () => {
      const slots = domain.generateSlots('09:00', '10:00', 30, 10);

      expect(slots).toEqual([
        '09:00',
        '09:10',
        '09:20',
        '09:30',
      ]);
    });
  });

  describe('filterAvailableSlots', () => {
    it('You must remove slots that conflict with the schedule', () => {
      const slots = ['14:00', '14:30', '15:00'];

      const result = domain.filterAvailableSlots(
        slots,
        [
          {
            start: new Date('2026-01-10T14:40'),
            end: new Date('2026-01-10T15:10'),
          },
        ],
        [],
        30
      );

      expect(result).toEqual(['14:00']);
    });

    it('Should not allow a slot that overlaps with the start of another appointment', () => {
      const slots = ['14:10'];

      const result = domain.filterAvailableSlots(
        slots,
        [
          {
            start: new Date('2026-01-10T14:40'),
            end: new Date('2026-01-10T15:10'),
          },
        ],
        [],
        30
      );

      expect(result).toEqual([]);
    });

    it('Must respect blocks with customized duration', () => {
      const slots = ['12:00', '12:30', '13:00'];

      const result = domain.filterAvailableSlots(
        slots,
        [],
        [
          { time: '12:00', duration: 60 },
        ],
        30
      );

      expect(result).toEqual(['13:00']);
    });

    it('Buffer between appointments must be respected', () => {
      const slots = ['14:00', '14:20', '14:40'];

      const result = domain.filterAvailableSlots(
        slots,
        [
          {
            start: new Date('2026-01-10T15:00'),
            end: new Date('2026-01-10T15:30'),
          },
        ],
        [],
        20,
        20
      );

      expect(result).toEqual(['14:00']);
    });

    it('Slots should be allowed when there are no conflicts', () => {
      const slots = ['09:00', '09:30'];

      const result = domain.filterAvailableSlots(
        slots,
        [],
        [],
        30
      );

      expect(result).toEqual(['09:00', '09:30']);
    });
  });
});
