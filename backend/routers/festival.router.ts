import { Router } from "express";
import { getFestivalsFromAi } from "../services/festival.service";

export const festivalRouter = Router();

festivalRouter.post("/", getFestivalsFromAi)
