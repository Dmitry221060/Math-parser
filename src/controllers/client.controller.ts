import express from 'express';
import path from 'path';

const app = express();

app.use('/static', express.static(path.join(__dirname, '../client')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

export default app;
