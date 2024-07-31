import express, { Request, Response, NextFunction } from "express";
import logger from "./logger";
import { carTable, db } from "./drizzle";

const app = express();
const router = express.Router();

const port = 8080;
app.use(express.json());

router.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({ message: "/" + req.method });
  next();
});

router.get("/status", (req: Request, res: Response) => {
  logger.info("status checked");
  res.status(200).send();
});

router.post("/car", async (req: Request, res: Response) => {
  logger.info(req.body);
  const newId = req.body.carId;
  const newStatus = "pending";
  const newCar = await db
    .insert(carTable)
    .values({ id: newId, status: newStatus })
    .returning();
  if (!newCar) {
    res.status(500);
  } else {
    res.status(200);
  }
});

app.use("/", router);

app.listen(port, () => {
  logger.info({
    message: "Example app listening on port 8080!",
  });
});
