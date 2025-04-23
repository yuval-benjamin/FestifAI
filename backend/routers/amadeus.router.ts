import { Router } from 'express'
import { flightOffersSearch, retreiveAmadeusToken, hotelOffersSearch } from '../controllers/amadeus.controller';

export const amadeusRouter = Router();

amadeusRouter.post("/", retreiveAmadeusToken)
amadeusRouter.get("/flight-offers", flightOffersSearch)
amadeusRouter.get("/hotel-offers", hotelOffersSearch)
