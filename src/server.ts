import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import routes from "./routers/routers";
import db from "./configs/db.mongodb";
import newSaveCron from "./Jobs/saveNews";
import loggerMiddleware from "./middleware/logger";
import logger from "./utils/logger";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("connected", () => logger.info("Connect to Mongodb Database"));
db.on("disconnected", () => logger.error("Database disconnected"));

const app = express();

app.set("view engine", "ejs");

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

routes(app);

newSaveCron.start();

app.listen(PORT, () => {
  console.log(`Application running successfully on ${PORT}`);
});
