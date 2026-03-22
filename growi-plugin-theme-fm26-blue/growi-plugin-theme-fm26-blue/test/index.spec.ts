import * as path from 'node:path';
import { describe, test, expect } from 'vitest';
import { validateThemePluginGrowiDirective } from '@growi/pluginkit/dist/v4/server';

describe('package.json', () => {
  test('should pass validation', () => {
    const projectDirRoot = path.resolve(__dirname, '..');
    const result = validateThemePluginGrowiDirective(projectDirRoot);
    expect(result.themes.length).toBeGreaterThan(0);
  });
});
