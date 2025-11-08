import axios from 'axios';
import express from 'express';
import { join } from 'node:path';
import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

const browserDistFolder = join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine();

// --- 1. Проксирующий endpoint для FastAPI ---
app.use('/api', async (req, res, next) => {
  try {
    const url = `http://localhost:5000${req.path}`; // проксируем путь
    const response = await axios({
      method: req.method as any,
      url: url,
      headers: {
        ...req.headers,
        host: 'localhost:5000',
        cookie: req.headers.cookie || '' // передаем куки
      },
      data: req.body
    });

    res.status(response.status).send(response.data);
  } catch (err: any) {
    if (err.response) {
      res.status(err.response.status).send(err.response.data);
    } else {
      next(err);
    }
  }
});

// --- 2. Статика ---
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// --- 3. SSR Angular ---
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// --- 4. Запуск сервера ---
const port = process.env['PORT'] || 4000;
app.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
