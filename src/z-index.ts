import { isFlexOrGridItem } from './flex-item';

/**
 * Get the effective z-index of an element
 *
 * @param el The element to get the effective z-index of
 * @returns The effective z-index value, or undefined if not applicable
 */
export function getEffectiveZIndex(el: Element) {
  const { position, zIndex } = getComputedStyle(el);
  if (zIndex === 'auto') {
    return;
  }
  if (position === 'static' && !isFlexOrGridItem(el)) {
    return;
  }
  const z = parseInt(zIndex);
  if (Number.isFinite(z)) {
    return z;
  }
}
