const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use("/api/v1/users", userRoutes);

// 404 route handler
app.use((req, res, next) => {
  const error = new Error("Route does not exist");
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
