import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./db.js";
import userroute from "./route/userroute.js";
import notesroute from "./route/notesroute.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

app.use(
  cors({
    origin: CLIENT_URL === "*" ? "*" : [CLIENT_URL, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/user", userroute);
app.use("/notes", notesroute);

app.get("/", (req, res) => {
  res.status(200).json({ message: "SERVER IS RUNNING SUCCESSFULLY" });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});