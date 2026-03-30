import 'dotenv/config';
import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 3000;

app.listen(PORT, env.HOST, () => {
  console.log(`✅ Serveur démarré sur http://${env.HOST}:${PORT}`);
  console.log(`📚 Swagger disponible sur http://${env.HOST}:${PORT}/api-docs`);
});