import express from 'express';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import m2s from 'mongoose-to-swagger';

import globalErrHandler from './controllers/errorController';
import { basicAuth } from './middleware/auth';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import postRouter from './routes/post.routes';
import commentRouter from './routes/comment.routes';
import AppError from './utils/appError';

import User from './models/user.model';
import Post from './models/post.model';
import Comment from './models/comment.model';

const app = express();

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'api-test-easy API with Swagger',
      version: '0.1.0',
      description: 'This is a nodejs application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:3004',
      },
    ],
    components: {
      schemas: {
        User: m2s(User),
        Post: m2s(Post),
        Comment: m2s(Comment),
      },
    },
  },
  apis: [`${__dirname}/controllers/*.ts`],
};

const specs = swaggerJsdoc(options);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'server running' });
});

// mounting routes

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.get('/api/auth/basic', basicAuth, (req, res, next) => {
  res.status(200).json({ status: 'success', message: 'basic auth success' });
});
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', commentRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrHandler);

export default app;
