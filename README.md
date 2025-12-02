# compare-stacking-order

Compare stacking order of two nodes.

## Usage

```ts
import { compareStackingOrder } from 'compare-stacking-order';

const order = compareStackingOrder(a, b);
// `1` if a is in front of b, `-1` otherwise.
```

## Why

I’ve found it remarkably challenging to determine the rendering order of two nodes with pure CSS. You must account for [Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_context), [Stacking Floating Elements Rules](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Positioned_layout/Stacking_floating_elements), and certain inheritance relationships of rendering layers that are almost undocumented – which led to the creation of this package.

Check out the [Demo on StackBlitz](https://stackblitz.com/edit/stackblitz-starters-u1pc82fa?file=index.html) to see various edge cases encountered during the package’s development – contributions are welcome ;)
