const express = require('express'), router = express.Router();
const Amadeus = require("amadeus");

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

const amadeus = new Amadeus({
    clientId: API_KEY,
    clientSecret: API_SECRET
})

const API = "amadeus";

// City search suggestions
router.get(`/${API}/search`, async (req, res) => {
  const { keyword } = req.query;
  const response = await amadeus.referenceData.locations.get({
    keyword,
    subType: Amadeus.location.city,
  });
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});

// Querying hotels
router.get(`/${API}/hotels`, async (req, res) => {
  const { cityCode } = req.query;
  amadeus.referenceData.locations.hotels.byCity.get({
    cityCode
  }).then(response => res.json(JSON.parse(response.body)))
  .catch(err => res.json(err));
});

// Querying hotel offers
router.get(`/${API}/offers`, async (req, res) => {
  const { hotelIds, checkIn, checkOut, rooms } = req.query;
  amadeus.shopping.hotelOffersSearch.get({
    hotelIds: hotelIds,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    roomQuantity: rooms,
    currency: "USD",
    bestRateOnly: false
  }).then(response => res.json(JSON.parse(response.body)))
  .catch(err => res.json(err));
});

// Confirming the offer
router.get(`/${API}/offer`, async (req, res) => {
  const { offerId } = req.query;
  const response = await amadeus.shopping.hotelOffer(offerId).get();
  try {
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

// Booking
router.post(`/${API}/booking`, async (req, res) => {
  const { offerId } = req.query;
  const { body } = req;
  const response = await amadeus.booking.hotelBookings.post(
    JSON.stringify({
      data: {
        offerId,
        guests: body.guests,
        payments: body.payments,
      },
    })
  );
  try {
    await res.json(JSON.parse(response.body));
  } catch (err) {
    await res.json(err);
  }
});

router.get(`/${API}/flights`, async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults } = req.query;
  const response = await amadeus.shopping.flightOffersSearch.get({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate: departureDate,
    returnDate: returnDate,
    adults: adults
  });
  try {
    res.json(JSON.parse(response.body));
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;