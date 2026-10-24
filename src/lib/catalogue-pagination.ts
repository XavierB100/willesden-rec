export const CATALOGUE_ROWS = 6;

// Keep these media queries aligned with .product-grid in globals.css.
export const CATALOGUE_BREAKPOINTS = [
  { query: "(min-width: 80rem)", columns: 5 },
  { query: "(min-width: 64rem)", columns: 4 },
  { query: "(min-width: 48rem)", columns: 3 },
] as const;

export function cataloguePage(total: number, columns: number, anchor = 0) {
  const perPage = CATALOGUE_ROWS * columns;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(
    pageCount,
    Math.max(1, Math.floor(anchor / perPage) + 1),
  );
  const start = (page - 1) * perPage;
  return {
    page,
    pageCount,
    perPage,
    start,
    end: Math.min(total, start + perPage),
  };
}
