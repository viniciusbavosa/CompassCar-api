import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router } from "./src/router/routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ errors: ["Internal server error"] });
});

export const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
