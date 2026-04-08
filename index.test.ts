import { describe, it, expect } from 'vitest';
import { paginate } from './src/index';

// ─── paginate() ───────────────────────────────────────────────────────────────

describe('paginate — basic cases', () => {
  it('middle of a large list (desktop delta=2)', () => {
    const { pages } = paginate({ current: 9, total: 48 });
    expect(pages).toEqual([1, '...', 7, 8, 9, 10, 11, '...', 48]);
  });

  it('middle of a large list (mobile delta=1)', () => {
    const { pages } = paginate({ current: 9, total: 48, delta: 1 });
    expect(pages).toEqual([1, '...', 8, 9, 10, '...', 48]);
  });

  it('first page', () => {
    const { pages } = paginate({ current: 1, total: 48 });
    expect(pages).toEqual([1, 2, 3, '...', 48]);
  });

  it('last page', () => {
    const { pages } = paginate({ current: 48, total: 48 });
    expect(pages).toEqual([1, '...', 46, 47, 48]);
  });

  it('second page', () => {
    const { pages } = paginate({ current: 2, total: 48 });
    expect(pages).toEqual([1, 2, 3, 4, '...', 48]);
  });

  it('penultimate page', () => {
    const { pages } = paginate({ current: 47, total: 48 });
    expect(pages).toEqual([1, '...', 45, 46, 47, 48]);
  });
});

describe('paginate — small lists (no ellipsis)', () => {
  it('single page', () => {
    const { pages } = paginate({ current: 1, total: 1 });
    expect(pages).toEqual([1]);
  });

  it('5 pages — shows all without ellipsis', () => {
    const { pages } = paginate({ current: 3, total: 5 });
    expect(pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('7 pages with delta=2 — shows all', () => {
    const { pages } = paginate({ current: 4, total: 7 });
    expect(pages).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});

describe('paginate — ellipsis does not hide a single number', () => {
  it('gap of 1 page shows the page number instead of "..."', () => {
    // current=4, total=10, delta=2 → window [2,3,4,5,6]
    // gap between 6 and 10 is 4 → ellipsis
    // gap between 1 and 2 is 1 → no ellipsis
    const { pages } = paginate({ current: 4, total: 10 });
    expect(pages).toEqual([1, 2, 3, 4, 5, 6, '...', 10]);
  });

  it('one skipped page between window and end renders the page', () => {
    // current=7, total=10, delta=2 → window [5,6,7,8,9], +1, +10
    // gap between 9 and 10 is 1 → insert the page
    const { pages } = paginate({ current: 7, total: 10 });
    expect(pages).toEqual([1, '...', 5, 6, 7, 8, 9, 10]);
  });
});

describe('paginate — metadata', () => {
  it('hasPrevious=false on the first page', () => {
    const result = paginate({ current: 1, total: 10 });
    expect(result.hasPrevious).toBe(false);
    expect(result.hasNext).toBe(true);
  });

  it('hasNext=false on the last page', () => {
    const result = paginate({ current: 10, total: 10 });
    expect(result.hasPrevious).toBe(true);
    expect(result.hasNext).toBe(false);
  });

  it('both true in the middle', () => {
    const result = paginate({ current: 5, total: 10 });
    expect(result.hasPrevious).toBe(true);
    expect(result.hasNext).toBe(true);
  });

  it('returns current and total', () => {
    const result = paginate({ current: 3, total: 20 });
    expect(result.current).toBe(3);
    expect(result.total).toBe(20);
  });
});

describe('paginate — boundary values and errors', () => {
  it('throws RangeError if current < 1', () => {
    expect(() => paginate({ current: 0, total: 10 })).toThrow(RangeError);
  });

  it('throws RangeError if current > total', () => {
    expect(() => paginate({ current: 11, total: 10 })).toThrow(RangeError);
  });

  it('throws RangeError if total < 1', () => {
    expect(() => paginate({ current: 1, total: 0 })).toThrow(RangeError);
  });

  it('does not throw for edge valid values', () => {
    expect(() => paginate({ current: 1, total: 1 })).not.toThrow();
    expect(() => paginate({ current: 100, total: 100 })).not.toThrow();
  });
});

describe('paginate — large delta', () => {
  it('delta=0 shows only first, current, and last', () => {
    const { pages } = paginate({ current: 10, total: 50, delta: 0 });
    expect(pages).toEqual([1, '...', 10, '...', 50]);
  });

  it('delta=10 on a small list shows all pages', () => {
    const { pages } = paginate({ current: 5, total: 8, delta: 10 });
    expect(pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('paginate — options validation', () => {
  it('throws RangeError if delta < 0', () => {
    expect(() => paginate({ current: 5, total: 10, delta: -1 })).toThrow(RangeError);
  });

  it('throws RangeError if edgeCount < 1', () => {
    expect(() => paginate({ current: 5, total: 10, edgeCount: 0 })).toThrow(RangeError);
  });
});

describe('paginate — edgeCount and ellipsis', () => {
  it('edgeCount=2 shows two edge pages', () => {
    const { pages } = paginate({ current: 10, total: 20, edgeCount: 2 });
    expect(pages).toEqual([1, 2, '...', 8, 9, 10, 11, 12, '...', 19, 20]);
  });

  it('custom ellipsis works', () => {
    const { pages } = paginate({ current: 10, total: 20, delta: 1, ellipsis: '•' });
    expect(pages).toEqual([1, '•', 9, 10, 11, '•', 20]);
  });
});
