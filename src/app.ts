import cors from 'cors';
import express from 'express';
import path from 'path';
import { errors } from 'celebrate';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import swaggerSpec from './swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());

export default app;

