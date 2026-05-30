const NON_SLUG_CHARS = /[^a-z0-9]+/g
const EDGE_DASHES = /^-+|-+$/g
const FALLBACK_SLUG = 'showcase'

export const toFileSlug = (value: string): string => {
  const slug = value
    .toLowerCase()
    .replace(NON_SLUG_CHARS, '-')
    .replace(EDGE_DASHES, '')

  return slug.length > 0 ? slug : FALLBACK_SLUG
}
