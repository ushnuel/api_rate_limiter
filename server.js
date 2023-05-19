const express = require("express");
const updateRules = require("./lib/updateRules");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();

// Schedule the rules retriever to run every minute
setInterval(updateRules, 60000);

app.get("/api", rateLimiter, (req, res) => {
  res.send("API Response");
});

// Start the server
app.listen(8000, () => {
  console.log(`Server started on port 8000`);
});
