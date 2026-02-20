import { env } from "./config/env.config.js"

import app from './app.js';

const PORT = env.port;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 