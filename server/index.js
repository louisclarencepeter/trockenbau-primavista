import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const port = Number(process.env.PORT || 8787);

app.listen(port, () => {
  console.log(`[server] Listening on http://localhost:${port}`);
});
