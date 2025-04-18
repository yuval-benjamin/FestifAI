import { Request, Response } from "express";
import * as https from "https";
import path from "path";
import * as querystring from "querystring";

export const retreiveAmadeusToken = (request: Request, res: Response) => {
    const body = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET
    });
    const options = {
        hostname: `${process.env.AMADEUS_BASE_URL}`,
        path: '/v1/security/oauth2/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
}

    const req = https.request(options, ( response) => {
        let data = '';
        response.on('data', (chunk) => {
        data = data + chunk.toString();
        });

        response.on('end', () => {
        const body = JSON.parse(data);
        console.log(body);
        res.status(response.statusCode!).send(body);
        });
    })

    req.on('error', (error) => {
    console.log('An error', error);
    res.status(500).send(error.message);

    });

    req.write(body);
    req.end()
}

export const flightOffersSearch = async (request: Request, res: Response) => {
  const options = {
  hostname: process.env.AMADEUS_API_BASE_URL,
  headers: { authorization:
    `Bearer ${request.headers.amadeus_access_token}`},
  agent: new https.Agent({ rejectUnauthorized: false }),
  method: 'GET',
  path: `/v2/shopping/flight-offers?originLocationCode=${request.query.originLocationCode}&destinationLocationCode=${request.query.destinationLocationCode}&departureDate=${request.query.departureDate}&returnDate=${request.query.returnDate}&adults=${request.query.adults}&children=0&infants=0&travelClass=ECONOMY&currencyCode=ILS&max=3`,
};
    const req = https.request(options, (response) => {

    let data = '';
    response.on('data', (chunk) => {
    data = data + chunk.toString();
    });

        response.on('end', () => {
        const body = JSON.parse(data);
        console.log(body);
        res.status(response.statusCode!).send(body);
        });
})

    req.on('error', (error) => {
    console.log('An error', error);
    res.status(500).send(error.message);

    });
    req.end()
}

