import cors from 'cors';
import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import expressPlayground from 'graphql-playground-middleware-express';

import { ContextDomain } from './domains/Context';
import { createSchema } from './schema';
import { createGraphqlFetch } from './utils/executor';
import { requireEnv } from './utils/requireEnv';

const { FUEL_PROVIDER_URL } = requireEnv(['FUEL_PROVIDER_URL']);

// Create a server:
const app = express();

app.use(cors<cors.CorsRequest>());
app.use(express.json());

app.get(
  '/graphql',
  expressPlayground({
    endpoint: '/graphql',
    settings: {
      'schema.polling.enable': false,
    },
  }),
);

const executor = createGraphqlFetch(FUEL_PROVIDER_URL);
const schema = createSchema(executor);

app.post(
  '/graphql',
  createHandler({
    schema,
    async context() {
      return ContextDomain.createContext(FUEL_PROVIDER_URL);
    },
  }),
);

export default app;
