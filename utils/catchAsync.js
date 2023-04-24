const catchAsync = (func) => {
  return (req, res, next) => {
    try {
      func(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = catchAsync;
