export const validateBody =
  (validator) =>
  (req, res, next) => {
    try {
      validator(req.body);
      return next();
    } catch (error) {
      return next(error);
    }
  };
