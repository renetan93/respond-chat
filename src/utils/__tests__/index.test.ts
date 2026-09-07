import { formatTimestamp, generateUniqueNegativeNumber } from '..';

// jest.config.js pins process.env.TZ = 'UTC', so these are stable everywhere.
const NOW = new Date('2026-03-15T10:30:00.000Z');

describe('formatTimestamp', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('formats today as HH:mm', () => {
    expect(formatTimestamp('2026-03-15T08:05:00.000Z')).toBe('08:05');
  });

  it('formats the first instant of today as HH:mm', () => {
    expect(formatTimestamp('2026-03-15T00:00:00.000Z')).toBe('00:00');
  });

  it('formats the last instant of today as HH:mm', () => {
    expect(formatTimestamp('2026-03-15T23:59:59.000Z')).toBe('23:59');
  });

  it('formats yesterday as "Yesterday" regardless of time of day', () => {
    expect(formatTimestamp('2026-03-14T23:59:59.000Z')).toBe('Yesterday');
    expect(formatTimestamp('2026-03-14T00:00:00.000Z')).toBe('Yesterday');
  });

  it('formats anything older as dd/MM/yyyy', () => {
    expect(formatTimestamp('2026-03-13T23:59:59.000Z')).toBe('13/03/2026');
    expect(formatTimestamp('2025-12-01T09:00:00.000Z')).toBe('01/12/2025');
  });

  it('zero-pads single-digit days and months', () => {
    expect(formatTimestamp('2026-01-05T09:00:00.000Z')).toBe('05/01/2026');
  });
});

describe('generateUniqueNegativeNumber', () => {
  it('returns a negative integer', () => {
    const value = generateUniqueNegativeNumber();
    expect(value).toBeLessThan(0);
    expect(Number.isInteger(value)).toBe(true);
  });

  it('returns different values for different random draws at the same instant', () => {
    jest.useFakeTimers().setSystemTime(NOW);
    const random = jest.spyOn(Math, 'random');

    random.mockReturnValueOnce(0.1);
    const first = generateUniqueNegativeNumber();
    random.mockReturnValueOnce(0.9);
    const second = generateUniqueNegativeNumber();

    expect(first).not.toBe(second);
    jest.useRealTimers();
  });
});
