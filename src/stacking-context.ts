import { isInTopLayer } from './top-layer';
import { getEffectiveZIndex } from './z-index';

const STACKING_CONTEXT_PROPS = [
  'transform',
  'scale',
  'rotate',
  'translate',
  'filter',
  'backdropFilter',
  'perspective',
  'clipPath',
  'mask',
  'maskImage',
  'maskBorder',
] as Array<keyof CSSStyleDeclaration>;

const STACKING_CONTEXT_PROPS_REGEX =
  /\b(?:transform|scale|rotate|translate|filter|backdrop-filter|perspective|clip-path|mask|mask-image|mask-border)\b/;

const LAYOUT_OR_PAINT_CONTAIN_REGEX = /\b(?:layout|paint|strict|content)\b/;

/**
 * Check if an element creates a stacking context
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_context
 *
 * @param el The element
 * @returns Whether the element creates a stacking context
 */
export function createsStackingContext(el: Element) {
  // Root element of the document (<html>).
  if (el === document.documentElement) {
    return true;
  }

  // Element with a position value absolute or relative and z-index value other than auto.
  // Element that is a flex item with a z-index value other than auto.
  // Element that is a grid item with z-index value other than auto.
  const z = getEffectiveZIndex(el);
  if (z != null) {
    return true;
  }

  const style = getComputedStyle(el);

  // Element with a position value fixed or sticky.
  if (style.position === 'fixed' || style.position === 'sticky') {
    return true;
  }

  // Element with a container-type value size or inline-size set (See container queries).
  if (style.containerType === 'size' || style.containerType === 'inline-size') {
    return true;
  }

  // Element with an opacity value less than 1.
  if (style.opacity && Number(style.opacity) < 1) {
    return true;
  }

  // Element with a mix-blend-mode value other than normal.
  if (style.mixBlendMode && style.mixBlendMode !== 'normal') {
    return true;
  }

  // Element with any of the following properties with a value other than none: transform / scale / rotate / translate / filter / backdrop-filter / perspective / clip-path / mask / mask-image / mask-border
  if (
    STACKING_CONTEXT_PROPS.some((prop) => style[prop] && style[prop] !== 'none')
  ) {
    return true;
  }

  // Element with the isolation value isolate.
  if (style.isolation === 'isolate') {
    return true;
  }

  // Element with a will-change value specifying any property that would create a stacking context on non-initial value.
  if (STACKING_CONTEXT_PROPS_REGEX.test(style.willChange)) {
    return true;
  }

  // Element with a contain value of layout or paint, or a composite value that includes either of these values (i.e., contain: strict, contain: content).
  if (LAYOUT_OR_PAINT_CONTAIN_REGEX.test(style.contain)) {
    return true;
  }

  // Element placed into the top layer and its corresponding ::backdrop. Examples include fullscreen and popover elements.
  if (isInTopLayer(el)) {
    return true;
  }

  // Element that has had stacking context-creating properties (such as opacity) animated using @keyframes, with animation-fill-mode set to forwards.
  // @ignore

  return false;
}
