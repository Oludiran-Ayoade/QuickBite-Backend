const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case 400:
      res.json({
        Title: "Validation Err",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 401:
      res.json({
        Title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 403:
      res.json({
        Title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 404:
      res.json({
        Title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 500:
      res.json({
        Title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      break;
  }
};

module.exports = errorHandler;
