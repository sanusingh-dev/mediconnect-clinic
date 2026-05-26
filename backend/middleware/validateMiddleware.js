const validate = (fields) => {
  return (req, res, next) => {
    const errors = [];
    fields.forEach((field) => {
      if (!req.body[field]) {
        errors.push(`${field} is required`);
      }
    });
    if (errors.length > 0) {
      res.status(400);
      throw new Error(errors.join(', '));
    }
    next();
  };
};

module.exports = validate;
