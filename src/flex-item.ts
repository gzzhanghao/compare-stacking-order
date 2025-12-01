const FLEX_OR_GRID_VALUES = new Set([
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
]);

/**
 * Check if the element is a flex or grid item.
 *
 * @param el The element to check
 * @returns Whether the element is a flex or grid item
 */
export function isFlexOrGridItem(el: Element) {
  if (!el.parentElement) {
    return false;
  }
  const parentStyle = getComputedStyle(el.parentElement);
  return FLEX_OR_GRID_VALUES.has(parentStyle.display);
}
