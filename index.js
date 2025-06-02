import connectDB from "./src/db/mongoDB.js";
import dotenv from "dotenv";
import app from "./src/app.js";

const port = process.env.PORT || 8000;

dotenv.config({
  path: "./.env",
});

app.listen(port, async () => {
  await connectDB();
  console.log(`Your Server is Started in port ${port}`);
});
