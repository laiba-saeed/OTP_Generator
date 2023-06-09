const app = require("./app");

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
