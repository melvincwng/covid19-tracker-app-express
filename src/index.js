require("./utils/db");
const app = require("./app");
const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Express app started on http://localhost:${PORT}`);
});