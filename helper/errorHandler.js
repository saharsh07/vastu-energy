function errorHandler(err, req, res, next) {
  switch (err.name) {
    case "UnauthorizedError":
      // ! JWT Error
      res.status(401).json({
        hasError: true,
        message: "The user is not authorized",
      });
      break;
    case "ValidationError":
      // ! Validation Error
      res.status(401).json({
        hasError: true,
        message: "The user is not Validated",
      });
      break;
    default:
      // ! Error
      res.status(500).json({
        hasError: true,
        error: err,
      });
      break;
  }
}

module.exports = errorHandler;
