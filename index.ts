import express, { Request, Response, NextFunction } from "express";
import logger from "./logger";
import { carTable, db } from "./drizzle";
import { sql } from "drizzle-orm";

const app = express();
const router = express.Router();

const port = 8080;
app.use(express.json());

// Middleware for logging requests
router.use((req: Request, res: Response, next: NextFunction) => {
  logger.info({ message: "/" + req.method });
  next();
});

// Endpoint to check server status
router.get("/status", (req: Request, res: Response) => {
  logger.info("status checked");
  res.status(200).send("Server is running");
});

// Endpoint to fetch all available cars
router.get("/cars", async (req: Request, res: Response) => {
  try {
    const cars = await db.select().from(carTable);
    res.status(200).json(cars);
  } catch (error) {
    logger.error("Error fetching cars:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to update car status to 'bought'
router.post("/car", async (req: Request, res: Response) => {
  const carId = req.body.carId;

  try {
    // Update the car status to 'bought' in the database
    const updatedCar = await db.transaction(async (tx) => {
      const result = await tx
        .update(carTable)
        .set({ status: "bought" })
        .where(sql`${carTable.id} = ${carId}`)
        .returning();

      if (!result[0]) {
        logger.error(`Car with ID ${carId} not found or already purchased`);
        return null;
      }

      return result[0];
    });

    if (!updatedCar) {
      return res
        .status(404)
        .json({ message: "Car not found or already purchased" });
    }

    logger.info({ message: "Car status updated to bought", updatedCar });
    return res.status(200).json({
      message: "Car status updated to bought",
      updatedCar,
    });
  } catch (error) {
    logger.error("Error updating car status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Use the router
app.use("/", router);

// Start the server
app.listen(port, () => {
  logger.info({
    message: `Example app listening on port ${port}!`,
  });
});
