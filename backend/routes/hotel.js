const express = require('express'), router = express.Router();
const Hotel = require('../models/hotel');

router.post('/hotel', (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '8f3f6e5f1bmsh6350b365e87e9ecp128e08jsn2b1d5f327755',
            'X-RapidAPI-Host': 'hotels-com-provider.p.rapidapi.com'
        }
    };

    fetch('https://hotels-com-provider.p.rapidapi.com/v2/hotels/details?hotel_id=14786603&locale=en_US&domain=US', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
});

module.exports = router;