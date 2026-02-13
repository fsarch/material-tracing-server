/**
 * Escapes PostgreSQL wildcard characters in a search string to prevent SQL injection.
 * 
 * @param search - The search string to escape
 * @returns The escaped search string safe for use in LIKE/ILIKE queries
 */
export function escapeSqlWildcards(search: string): string {
  return search
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/%/g, '\\%')    // Escape % wildcards
    .replace(/_/g, '\\_');   // Escape _ wildcards
}
