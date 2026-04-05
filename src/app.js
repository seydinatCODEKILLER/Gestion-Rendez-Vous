import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import errorHandler from './middlewares/error-handler.middleware.js';
import notFound from './middlewares/not-found.middleware.js';
import ordonnanceRoutes from './routes/ordonnance.routes.js';
import patientRoutes from './routes/patient.routes.js';
import rvRoutes from './routes/rv.routes.js';
import medecinRoutes from './routes/medecin.routes.js';
import serviceRoutes from './routes/service.routes.js';
import authRoutes from './routes/auth.routes.js';
import authenticate from './middlewares/auth.middleware.js';
import { corsMiddleware, corsPreFlight } from './config/cors.js';

const app = express();

app.use(corsMiddleware);
app.options('/{*path}', corsPreFlight);
app.use(express.json());

// --- ROUTES PUBLIQUES ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes); // Accessible sans token
app.get('/health', (req, res) => res.status(200).json({ status: 'oks' }));

// --- MIDDLEWARE D'AUTHENTIFICATION GLOBAL ---
app.use(authenticate);

// --- ROUTES PROTÉGÉES ---
app.use("/api/ordonnances", ordonnanceRoutes);
app.use('/api/rendezvous', rvRoutes);
app.use('/api/medecins', medecinRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/services', serviceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;