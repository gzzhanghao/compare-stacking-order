import { describe, test, expect } from 'vitest';
import { createsStackingContext } from '../src/stacking-context';

describe('creates stacking context', () => {
  run('position: relative; z-index: 0');
  run('position: relative', false);
  run('position: relative; z-index: auto', false);

  run('position: static; z-index: 1', false);

  run('position: fixed');
  run('position: sticky');
  run('transform: translateZ(0)');
  run('isolation: isolate');
  run('will-change: transform');
  run('contain: strict');
  run('contain: paint');
  run('container-type: size');
  run('mix-blend-mode: multiply');

  run('opacity: 0.999');
  run('opacity: 1', false);

  test('documentElement', () => {
    expect(createsStackingContext(document.documentElement)).toBe(true);
  });
});

function run(style: string, willCreate = true) {
  test(style, () => {
    const el = document.createElement('div');
    el.setAttribute('style', style);
    document.body.appendChild(el);
    expect(createsStackingContext(el)).toBe(willCreate);
  });
}
