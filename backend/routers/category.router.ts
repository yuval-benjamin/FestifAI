import { Router } from "express";
import { retreiveCategoryItems } from "../controllers/category.controller";

export const categoryRouter = Router();

categoryRouter.get("/:category", retreiveCategoryItems)
