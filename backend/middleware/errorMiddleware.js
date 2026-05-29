export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === "CastError") {
    res.status(404);
    return res.json({ message: "Resource not found" });
  }

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0] || "field";
    res.status(409);
    return res.json({
      message:
        duplicateField === "email"
          ? "Email is already registered"
          : `${duplicateField} already exists`
    });
  }

  if (err.name === "ValidationError") {
    res.status(400);
    return res.json({
      message: Object.values(err.errors)
        .map((error) => error.message)
        .join(", ")
    });
  }

  res.status(statusCode).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
