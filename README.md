# pagination-algorithm

[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1.3-6E9F18.svg)](https://vitest.dev/)
[![@types/node](https://img.shields.io/badge/@types/node-25.5.2-blue.svg)](https://www.npmjs.com/package/@types/node)

Lightweight, zero-dependency pagination algorithm with ellipsis support.

## Install

```bash
npm install @numnumdevnull/pagination-algorithm
```

## Usage

```ts
import { paginate } from '@numnumdevnull/pagination-algorithm';

const result = paginate({ current: 9, total: 48 });
console.log(result.pages);
// [1, '...', 7, 8, 9, 10, 11, '...', 48]
```

## API / Options

### `paginate(options)`

| Option      | Type       | Default | Description                                   |
|-------------|------------|---------|-----------------------------------------------|
| `current`   | `number`   | —       | Current page (1-based)                        |
| `total`     | `number`   | —       | Total number of pages                         |
| `delta`     | `number`   | `2`     | Pages on each side of the current page        |
| `edgeCount` | `number`   | `1`     | Pages to show at the start and end of the list|
| `ellipsis`  | `string`   | `'...'` | Marker for skipped page ranges                |

Returns `PaginationResult`:

```ts
{
  pages: (number | string)[];  // Items to render
  hasPrevious: boolean;
  hasNext: boolean;
  current: number;
  total: number;
}
```

## Examples

### Desktop-style pagination

```ts
paginate({ current: 9, total: 48 });
// [1, '...', 7, 8, 9, 10, 11, '...', 48]
```

### Mobile-style pagination

```ts
paginate({ current: 9, total: 48, delta: 1 });
// [1, '...', 8, 9, 10, '...', 48]
```

### Show edge pages

```ts
paginate({ current: 10, total: 20, edgeCount: 2 });
// [1, 2, '...', 8, 9, 10, 11, 12, '...', 19, 20]
```

### Custom ellipsis marker

```ts
paginate({ current: 10, total: 20, ellipsis: '…' });
// [1, '…', 8, 9, 10, 11, 12, '…', 20]
```

## License

MIT

## Development / Test

Run tests locally before publishing:

```bash
npm install
npm test
```

Build the package:

```bash
npm run build
```

### How to run tests

Use the Vitest test runner:

```bash
npm test
```

To run tests in watch mode locally:

```bash
npm run test:watch
```

## Contributing

Contributions are welcome. If you want to improve the algorithm or add examples:

1. Fork the repo.
2. Create a feature branch.
3. Run `npm install`.
4. Run `npm test` and `npm run build`.
5. Open a pull request with a clear description.

Publish to npm:

```bash
npm test
npm run build
npm publish --access public
```

