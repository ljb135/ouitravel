const express = require('express');
const paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': '####yourclientid######',
  'client_secret': '####yourclientsecret#####'
});
const app = express();
app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));
app.listen(PORT, () => console.log(`Server Started on ${PORT}`));