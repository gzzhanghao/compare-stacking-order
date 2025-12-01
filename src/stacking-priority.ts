import { isFlexOrGridItem } from './flex-item';
import { createsStackingContext } from './stacking-context';
import { getEffectiveZIndex } from './z-index';

const PRIORITY_BLOCK = 1;
const PRIORITY_FLOAT = 2;
const PRIORITY_INLINE = 3;
const PRIORITY_POSITIONED = 4;

/**
 * Get the stacking priority of a node path
 *
 * Examples:
 * - f(`.float > div`) == 2 (FLOAT)
 * - f(`.float > span.relative`) == 4 (POSITIONED)
 *
 * @see https://stackblitz.com/edit/stackblitz-starters-u1pc82fa?file=index.html
 *
 * @param path The path to target node
 * @returns The stacking priority of the node path
 */
export function getPathStackingPriority(path: Node[]) {
  let maxPriority = 0;

  for (const node of path) {
    // Text nodes are treated as inline elements
    if (node.nodeType === Node.TEXT_NODE) {
      return Math.max(PRIORITY_INLINE, maxPriority);
    }
    const el = node as Element;
    const priority = getStackingPriority(el);
    if (priority < 0) {
      return priority;
    }
    if (createsStackingContext(el)) {
      return priority;
    }
    maxPriority = Math.max(maxPriority, priority);
  }

  return maxPriority;
}

/**
 * Get the stacking priority of an element
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_floating_elements
 *
 * @param el The target element
 * @returns The stacking priority of the element
 */
function getStackingPriority(el: Element) {
  const z = getEffectiveZIndex(el);
  if (z != null) {
    if (z < 0) {
      return z;
    }
    return PRIORITY_POSITIONED + z;
  }

  const style = getComputedStyle(el);
  if (style.position && style.position !== 'static') {
    return PRIORITY_POSITIONED;
  }

  /**
   * Stacking context roots are treated as positioned elements
   * @see https://stackblitz.com/edit/stackblitz-starters-u1pc82fa?file=index.html
   */
  if (createsStackingContext(el)) {
    return PRIORITY_POSITIONED;
  }

  if (style.float && style.float !== 'none') {
    return PRIORITY_FLOAT;
  }

  if (style.display.includes('inline')) {
    return PRIORITY_INLINE;
  }

  /**
   * Flex / Grid items are treated as inline elements
   * @see https://stackblitz.com/edit/stackblitz-starters-u1pc82fa?file=index.html
   */
  if (isFlexOrGridItem(el)) {
    return PRIORITY_INLINE;
  }

  return PRIORITY_BLOCK;
}
