import express from 'express';
import { flightOffersSearch, retreiveAmadeusToken } from '../controllers/amadeus.controller';

export const amadeusRouter = express.Router();
amadeusRouter.post('/', retreiveAmadeusToken)
amadeusRouter.get('/flight-offers', flightOffersSearch)

