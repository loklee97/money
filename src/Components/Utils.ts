export function toggleSort<T>(
  sortBy: keyof T,
  sortAsc: boolean,
  column: keyof T
): { sortBy: keyof T; sortAsc: boolean } {
  if (sortBy === column) {
    return { sortBy, sortAsc: !sortAsc };
  } else {
    return { sortBy: column, sortAsc: true };
  }
}

export function searchFilter<T>(
  list: T[],
  search: string,
  keys: (keyof T)[],
  customMatch?: (item: T, key: keyof T, value: any, search: string) => boolean
): T[] {
  const lowerSearch = search.toLowerCase();
  return list.filter(item =>
    keys.some(key => {
      const value = item[key];
      if (customMatch) return customMatch(item, key, value, search);
      return value?.toString().toLowerCase().includes(lowerSearch);
    })
  );
}

export function sortByValue<T>(
  a: T,
  b: T,
  key: keyof T,
  ascending = true
): number {
  const valA = a[key];
  const valB = b[key];

  if (typeof valA === 'number' && typeof valB === 'number') {
    return ascending ? valA - valB : valB - valA;
  }

  return ascending
    ? String(valA).localeCompare(String(valB))
    : String(valB).localeCompare(String(valA));
}