import { describe, expect, it } from 'vitest';

import { compareStackingOrder } from '../src/main';

describe('compare stacking order', () => {
  it('compare elements', () => {
    document.body.innerHTML = `
      <div id="a" style="position: relative">
        <div id="b" style="display: block"></div>
      </div>
    `;
    expect(
      compareStackingOrder(
        document.getElementById('a')!,
        document.getElementById('b')!,
      ),
    ).toBe(-1);
  });
});
