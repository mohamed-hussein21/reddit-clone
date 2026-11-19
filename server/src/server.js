import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';

const server = http.createServer(app);
initSocket(server);

connectDB()
  .then(() => server.listen(env.port, () => console.log(`🚀 Server on http://localhost:${env.port}`)))
  .catch((err) => {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  });
