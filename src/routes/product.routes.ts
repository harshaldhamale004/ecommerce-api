import { Router } from "express";
import * as ctrl from "../controllers/product.controller.js";

const router = Router();
router.post("/", ctrl.create);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.put("/:id", ctrl.update);
router.patch("/:id/stock", ctrl.updateStock);
router.delete("/:id", ctrl.remove);

export default router;