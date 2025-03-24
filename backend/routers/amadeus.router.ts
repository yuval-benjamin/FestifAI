import { Router } from 'express'
import { flightOffersSearch, retreiveAmadeusToken } from '../controllers/amadeus.controller';

export const amadeusRouter = Router();

amadeusRouter.post("/", retreiveAmadeusToken)
amadeusRouter.get("/flight-offers", flightOffersSearch)
