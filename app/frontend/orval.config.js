import { defineConfig } from 'orval';

export default defineConfig({
  todoApi: {
    input: {
      target: 'http://localhost:3000/api/docs-json',
    },
    output: {
      mode: 'split',
      target: 'app/api/generated.ts',
      schemas: 'app/api/schemas',
      client: 'swr',
      httpClient: 'fetch',
      baseUrl: '/api/v1',
    },
  },
});
