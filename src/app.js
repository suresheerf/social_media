const express = require('express');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const m2s = require('mongoose-to-swagger');

const app = express();

const globalErrHandler = require('./controllers/errorController');
const { protect } = require('./middleware/auth');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');
const commentRouter = require('./routes/comment.routes');
const AppError = require('./utils/appError');

const User = require('./models/user.model');
const Post = require('./models/post.model');
const Comment = require('./models/comment.model');

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
        url: 'http://localhost:3000',
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
  apis: ['./controller/*.js'],
};

const specs = swaggerJsdoc(options);

app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'server running' });
});

// mounting routes

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.use('/api', authRouter);
app.use('/api', protect, userRouter);
app.use('/api', protect, postRouter);
app.use('/api', protect, commentRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrHandler);

module.exports = app;
