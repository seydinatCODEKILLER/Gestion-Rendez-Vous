import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import errorHandler from './middlewares/error-handler.middleware.js';
import notFound from './middlewares/not-found.middleware.js';
import rvRoutes from './routes/rv.routes.js';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//routes ici
app.use('/api/rendezvous', rvRoutes);

//health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(notFound);
app.use(errorHandler);

export default app;