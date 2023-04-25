var express = require('express'), router = express.Router();
router.use(express.json());

const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

//create a new order
router.post("/my-server/create-paypal-order", async (req, res) => {
    try {
      const order = await paypal.createOrder();
      res.json(order);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

//capture payment & store order information or fullfill order
router.post("/my-server/capture-paypal-order", async (req, res) => {
    const { orderID } = req.body;
    try {
      const captureData = await paypal.capturePayment(orderID);
      //TODO: store payment information such as the transaction ID
      res.json(captureData);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });


//PayPal API helpers

//use the orders api to create an order
 async function createOrder() {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "100.00",
            },
          },
        ],
      }),
    });
  
    return handleResponse(response);
  }
  
//use the orders api to capture payment for an order
async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    return handleResponse(response);
  }
  
//generate an access token using cliend id and app secret
async function generateAccessToken() {
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "post",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
  
    const jsonData = await handleResponse(response);
    return jsonData.access_token;
  }
  
async function handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    }
  
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

module.exports = router;