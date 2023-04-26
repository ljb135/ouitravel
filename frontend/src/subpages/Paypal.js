import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

/*
const initialOptions = {
    "client-id": "AYvk_kMZLe9ZaOrBQSKBVpH3mA8zD2A7GRwWAaf9CqK6OEnL9bzu_x_N7F-2699ylU3skfWKgyX2ZugP",
    currency: "USD",
    intent: "capture",
    "data-client-token": "ENeMVe67G1vnQXECQ_ZwKfVsX3Vvb1BSt6K_90Cs2o1FRo-sy5LTgbFBSCzSRZ3TI8XS3Xi2RlsYTtD4",
};
*/

function Paypal(props) {
    const price = props.trip.price;

    const createOrder = async (data, actions) => {
        const request = {
            intent: 'capture',
            purchase_units: [
                {
                    amount: {
                        value: price,
                    }
                },
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        };
        return actions.order.create(request);
    }

    const onApprove = async (data, actions) => {
        return actions.order.capture().then((details) => {
            const name = details.payer.name.given_name;
            alert(`Transaction completed by ${name}`);
        });
    }

    return (
        <PayPalScriptProvider options={{"client-id": "AYvk_kMZLe9ZaOrBQSKBVpH3mA8zD2A7GRwWAaf9CqK6OEnL9bzu_x_N7F-2699ylU3skfWKgyX2ZugP"}}>
            <PayPalButtons
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
            />
        </PayPalScriptProvider>
    );
}
  
export default Paypal;