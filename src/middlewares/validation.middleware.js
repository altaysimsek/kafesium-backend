export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validasyon hatası',
      errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }
};

export const validateParams = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.params);
    next();
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validasyon hatası',
      errors: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }
}; 