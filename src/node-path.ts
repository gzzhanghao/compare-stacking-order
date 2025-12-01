export function* iterateNodePath(node: Node) {
  for (let current: Node | null = node; current; current = current.parentNode) {
    yield current;
  }
}
