import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      config: path.resolve(__dirname, './src/config'),
      routes: path.resolve(__dirname, './src/routes'),
      services: path.resolve(__dirname, './src/services'),
      utils: path.resolve(__dirname, './src/utils'),
      'constants.js': path.resolve(__dirname, './src/constants.ts'),
      'server.js': path.resolve(__dirname, './src/server.ts'),
      'types.js': path.resolve(__dirname, './src/types.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest-setup.ts'],
    exclude: ['dist'],
  },
});
