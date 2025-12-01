import { findDiffPath } from './diff-path';
import { iterateNodePath } from './node-path';
import { createsStackingContext } from './stacking-context';
import { getPathStackingPriority } from './stacking-priority';
import { getEffectiveZIndex } from './z-index';

/**
 * Compare the stacking order of two nodes
 *
 * @param a The first node to compare
 * @param b The second node to compare
 *
 * @returns `1` if a is in front of b, `-1` otherwise
 */
export function compareStackingOrder(a: Text | Element, b: Text | Element) {
  const position = a.compareDocumentPosition(b);
  if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
    return compareContainedStackingOrder(a as Element, b);
  }
  if (position & Node.DOCUMENT_POSITION_CONTAINS) {
    return -compareContainedStackingOrder(b as Element, a);
  }
  const [pathToA, pathToB] = findDiffPath(a, b);
  const priorityA = getPathStackingPriority(pathToA);
  const priorityB = getPathStackingPriority(pathToB);
  if (priorityA !== priorityB) {
    return priorityA > priorityB ? 1 : -1;
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1;
  }
  return -1;
}

/**
 * Compare the stacking order of an element and its descendant node
 *
 * @param parent The parent element
 * @param child The descendant node
 *
 * @returns `1` if parent is in front of child, `-1` otherwise
 */
function compareContainedStackingOrder(parent: Element, child: Node) {
  const path: Node[] = [];
  for (const p of iterateNodePath(child)) {
    if (p === parent) {
      break;
    }
    path.push(p);
  }
  path.reverse();

  for (const node of path) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return -1;
    }
    const el = node as Element;
    if (!createsStackingContext(el)) {
      continue;
    }
    const z = getEffectiveZIndex(el) || 0;
    return z < 0 ? 1 : -1;
  }

  return -1;
}
