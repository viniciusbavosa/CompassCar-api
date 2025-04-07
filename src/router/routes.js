import { Router } from "express";
import {
  createCarController,
  getCarController,
  listCarsController,
  updateCarController,
  deleteCarController,
} from "../controllers/carsController.js";
import { updateCarItemController } from "../controllers/carItemsController.js";

export const router = Router();

router.get("/cars", listCarsController);

router.get("/cars/:id", getCarController);

router.post("/cars", createCarController);

router.put("/cars/:id/items", updateCarItemController);

router.patch("/cars/:id", updateCarController);

router.delete("/cars/:id", deleteCarController);
