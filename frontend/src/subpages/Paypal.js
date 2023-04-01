import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function Paypal() {
    return (
        <PayPalScriptProvider options={{ "client-id": "AYvk_kMZLe9ZaOrBQSKBVpH3mA8zD2A7GRwWAaf9CqK6OEnL9bzu_x_N7F-2699ylU3skfWKgyX2ZugP" }}>
            <PayPalButtons style={{ layout: "vertical" }} />
        </PayPalScriptProvider>
    );
}
  
export default Paypal;