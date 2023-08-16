const express = require('express');
const morgan = require('morgan');
const app = express();

const globalErrHandler = require('./controllers/errorController');
const { protect } = require('./middleware/auth');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');
const commentRouter = require('./routes/comment.routes');
const AppError = require('./utils/appError');

app.use(express.json());
app.use(express.urlencoded({extends:true}));
app.use(morgan('dev'));
app.get('/', (req, res) => {
  res.status(200).json({ message: 'server running' });
});

app.use('/api', authRouter);
app.use('/api', protect, userRouter);
app.use('/api', protect, postRouter);
app.use('/api', protect, commentRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrHandler);

module.exports = app;
