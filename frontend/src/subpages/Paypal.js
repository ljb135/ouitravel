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
            ]
        };
        return actions.order.create(request);
    }

    const onApprove = async (data, actions) => {
        return actions.order.capture().then((details) => {
            const name = details.payer.name.given_name;

            let body = new URLSearchParams({
                status: "Paid"
              });
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
          
              let requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: body,
                'credentials': 'include'
              };
          
              fetch(`http://localhost:3001/trip/id/${props.trip._id}`, requestOptions)
              .then(response => {
                  if(response.ok){
                    alert(`Transaction completed by ${name}`);
                    props.update();
                    props.close();
                  }
                  else{
                    alert(response.text());
                  }
              });
            
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