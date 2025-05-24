import { Router } from 'express'
import { flightOffersSearch, retreiveAmadeusToken, hotelOffersSearch, hotels, hotelRatings } from '../controllers/amadeus.controller';

export const amadeusRouter = Router();

amadeusRouter.post("/", retreiveAmadeusToken)
amadeusRouter.get("/flight-offers", flightOffersSearch)
amadeusRouter.get("/hotel-offers", hotelOffersSearch)
amadeusRouter.get("/hotels", hotels)
amadeusRouter.get("/hotel-ratings", hotelRatings)
