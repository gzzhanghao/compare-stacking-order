import { iterateNodePath } from './node-path';

/**
 * Find the diff path of two nodes
 *
 * @param a The first node
 * @param b The second node
 * @returns Two arrays containing the paths from the common parent to each node
 */
export function findDiffPath(a: Node, b: Node) {
  const pathA: Node[] = [];

  let commonAncestor: Element | undefined;
  for (const node of iterateNodePath(a)) {
    if (node.contains(b)) {
      commonAncestor = node as Element;
      break;
    }
    pathA.push(node);
  }

  const pathB: Node[] = [];
  for (const node of iterateNodePath(b)) {
    if (node === commonAncestor) {
      break;
    }
    pathB.push(node);
  }

  return [pathA.reverse(), pathB.reverse()];
}
