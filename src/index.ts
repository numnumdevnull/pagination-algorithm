export type PageItem = number | string;

export interface PaginationOptions {
  /** Current page (1-based) */
  current: number;
  /** Total number of pages */
  total: number;
  /** Pages on each side of the current page */
  delta?: number;
  /** Pages to show at the start and end of the list */
  edgeCount?: number;
  /** Marker used for skipped page ranges */
  ellipsis?: string;
}

export interface PaginationResult {
  pages: PageItem[];
  hasPrevious: boolean;
  hasNext: boolean;
  current: number;
  total: number;
}

/**
 * Generates a pagination page list with ellipsis markers.
 *
 * @example
 * paginate({ current: 9, total: 48 })
 * // { pages: [1, '...', 7, 8, 9, 10, 11, '...', 48], ... }
 *
 * @example
 * paginate({ current: 9, total: 48, delta: 1 })
 * // { pages: [1, '...', 8, 9, 10, '...', 48], ... }
 */
export function paginate(options: PaginationOptions): PaginationResult {
  const {
    current,
    total,
    delta = 2,
    edgeCount = 1,
    ellipsis = '...',
  } = options;

  if (total < 1) throw new RangeError('total must be >= 1');
  if (current < 1 || current > total)
    throw new RangeError(`current must be between 1 and ${total}`);
  if (delta < 0) throw new RangeError('delta must be >= 0');
  if (edgeCount < 1) throw new RangeError('edgeCount must be >= 1');

  const pages = buildPages(current, total, delta, edgeCount, ellipsis);

  return {
    pages,
    hasPrevious: current > 1,
    hasNext: current < total,
    current,
    total,
  };
}

// ─── internal ────────────────────────────────────────────────────────────────

function buildPages(
  current: number,
  total: number,
  delta: number,
  edgeCount: number,
  ellipsis: string
): PageItem[] {
  // Collect unique page numbers that should appear in pagination
  const pageSet = new Set<number>();

  const firstEdgeEnd = Math.min(edgeCount, total);
  for (let i = 1; i <= firstEdgeEnd; i++) pageSet.add(i);

  const lastEdgeStart = Math.max(total - edgeCount + 1, 1);
  for (let i = lastEdgeStart; i <= total; i++) pageSet.add(i);

  const left = Math.max(firstEdgeEnd + 1, current - delta);
  const right = Math.min(lastEdgeStart - 1, current + delta);
  for (let i = left; i <= right; i++) {
    pageSet.add(i);
  }

  const sorted = Array.from(pageSet).sort((a, b) => a - b);

  const result: PageItem[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const page = sorted[i];
    const prev = sorted[i - 1];

    if (prev !== undefined) {
      const gap = page - prev;
      if (gap === 2) {
        result.push(prev + 1);
      } else if (gap > 2) {
        result.push(ellipsis);
      }
    }

    result.push(page);
  }

  return result;
}
