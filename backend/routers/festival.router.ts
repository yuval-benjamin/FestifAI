import { Router } from "express";
import { getFestivalsFromAi } from "../controllers/festival.controller";

export const festivalRouter = Router();

festivalRouter.get("/", getFestivalsFromAi)
