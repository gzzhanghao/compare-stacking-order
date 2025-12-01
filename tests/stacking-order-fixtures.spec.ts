import fs from 'node:fs/promises';
import path from 'node:path';

import { glob } from 'glob';
import { describe, expect, test } from 'vitest';

import { compareStackingOrder } from '../src/main';

describe('stacking order fixtures', async () => {
  const fixtures = await glob(
    process.env.TEST_FIXTURES || 'fixtures/**/*.html',
    { cwd: __dirname },
  );

  for (const fixture of fixtures) {
    test(fixture, async () => {
      document.body.innerHTML = await fs.readFile(
        path.resolve(__dirname, fixture),
        'utf-8',
      );
      const all: Array<Element | Text> = [document.body];
      for (const node of all) {
        for (const child of node.childNodes) {
          if (child.nodeName === 'STYLE') {
            continue;
          }
          if (
            child.nodeType === Node.ELEMENT_NODE ||
            (child.nodeType === Node.TEXT_NODE && child.textContent?.trim())
          ) {
            all.push(child as Element | Text);
          }
        }
      }
      const sorted = all.sort(compareStackingOrder).map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent?.trim() || '';
        }
        const el = node as Element;
        if (el.id) {
          return `#${el.id}`;
        }
        return `<${el.tagName}>`;
      });
      expect(sorted).toMatchSnapshot();
    });
  }
});
