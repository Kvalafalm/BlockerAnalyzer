import express, { Express, Request, Response } from 'express';
import config from 'config';
import mongoose from 'mongoose';

import routerImportData from './server/core/ImportData/ImportData-routes.js';
import issueRouter from './server/core/issue/issue-routes.js';
import accountRouter from './server/core/account/account-routes.js'; 
import blockerRouter from './server/core/bloker/Blocker-routes.js';
import routerProject from './server/core/project/project-routes.js';
import path from 'path';
import errorMiddleware from './server/middleware/error.middleware';

const app: Express = express();
const PORT: number = config.get('port') || 5000;
if (process.env.NODE_ENV === 'production') {
  app.use(
    '/',
    express.static(path.join(config.get('baseUrl'), 'client', 'build'))
  );
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(
      path.resolve(config.get('url'), 'client', 'build', 'index.html')
    );
  });
}

if (process.env.NODE_ENV === 'development') {
  app.use(
    '/',
    express.static(path.join(config.get('baseUrl'), 'client', 'public'))
  );
}
app.use(express.json());
app.use('/api/v1/blocker', blockerRouter);
app.use('/api/v1/importData', routerImportData);
app.use('/api/v1/project', routerProject);
app.use('/api/v1/issue', issueRouter);
app.use('/api/v1/account', accountRouter); 

app.use(errorMiddleware);

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'));
    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    );
  } catch (e) {
    if (e instanceof Error) {
      console.log('Server Error', e.message);
    }
    process.exit(1);
  }
}

start();