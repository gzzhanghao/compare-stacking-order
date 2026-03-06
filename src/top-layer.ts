/**
 * Check if an element is in the top layer
 *
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Top_layer
 *
 * @param el The element to check
 * @returns Whether the element is in the top layer
 */
export function isInTopLayer(el: Element): boolean {
  // Fullscreen element
  if (el === document.fullscreenElement) {
    return true;
  }

  // Dialog element shown with showModal() (modal dialogs are in the top layer)
  try {
    if (el instanceof HTMLDialogElement && el.matches(':modal')) {
      return true;
    }
  } catch {
    // noop
  }

  // Popover elements that are currently open
  try {
    if (el.matches(':popover-open')) {
      return true;
    }
  } catch {
    // noop
  }

  return false;
}
