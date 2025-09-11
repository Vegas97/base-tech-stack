// Generic utilities for extracting API parameters from URL search params

// Generic pagination extractor
export function extractPaginationParams(searchParams: URLSearchParams) {
  const numItems = searchParams.get("numItems");
  const cursor = searchParams.get("cursor");
  
  return {
    numItems: numItems ? parseInt(numItems) : 20,
    cursor: cursor || null,
  };
}

// Generic sort extractor
export function extractSortParams(searchParams: URLSearchParams) {
  const sort: any = {};
  
  const sortField = searchParams.get("sortField");
  const sortDirection = searchParams.get("sortDirection");
  
  if (sortField) sort.field = sortField;
  if (sortDirection) sort.direction = sortDirection;
  
  return sort;
}

// Generic filter extractor using validator keys
export function extractFiltersFromKeys(
  searchParams: URLSearchParams,
  filterKeys: readonly string[]
): Record<string, any> {
  const filters: Record<string, any> = {};
  
  filterKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value !== null && value !== '') {
      filters[key] = value; // Pass as string, Convex converts
    }
  });
  
  return filters;
}
