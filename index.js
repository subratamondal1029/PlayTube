import "./config/env.js";
import connectDB from "./src/db/mongoDB.js";
import app from "./src/app.js";

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  await connectDB();
  console.log(`Your Server is Started in port ${port}`);
});
