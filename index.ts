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
  const newModel = req.body.model;
  const newColor = req.body.color;
  const newBrand = req.body.brand;
  const newProdYear = req.body.productionYear;
  const newPrice = req.body.price;
  const newPaymentStatus = req.body.paymentStatus;
  const newStatus = "pending";

  try {
    await db.transaction(async (tx) => {
      logger.info({ message: "warehouse received", newId });

      const newCar = await tx
        .insert(carTable)
        .values({
          id: newId,
          status: newStatus,
          model: newModel,
          color: newColor,
          brand: newBrand,
          productionYear: newProdYear,
          price: newPrice,
          paymentStatus: newPaymentStatus,
        })
        .returning();

      if (!newCar[0]) {
        logger.error("Failed to insert new car record");
        await tx.rollback();
        return res.sendStatus(500);
      } else if (newCar[0].status === "pending") {
        logger.info({ message: "car success", newCar });
        return res.status(200).json({
          message: "Car record created successfully",
          newCar: newCar[0],
        });
      }
    });
  } catch (error) {
    logger.error("Transaction error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.use("/", router);

app.listen(port, () => {
  logger.info({
    message: "Example app listening on port 8080!",
  });
});
