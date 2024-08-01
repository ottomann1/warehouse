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
  const newId = req.body.carId;
  const newStatus = "pending";
  await db.transaction(async (tx) => {
    logger.info({ message: "warehouse received", newId });
    const newCar = await tx
      .insert(carTable)
      .values({ id: newId, status: newStatus })
      .returning();

    if (!newCar[0]) {
      await tx.rollback();
      logger.error("Failed to insert new car record");
      return res.sendStatus(500);
    } else if (newCar[0].status === "pending") {
      logger.info({ message: "car success", newCar });
      return res
        .status(200)
        .json({ message: "Car record created successfully", newCar });
    }
  });
});
app.use("/", router);

app.listen(port, () => {
  logger.info({
    message: "Example app listening on port 8080!",
  });
});
