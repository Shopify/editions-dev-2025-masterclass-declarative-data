import {useEffect, useState} from 'react';
import {
  reactExtension,
  Banner,
  useShippingAddress,
  useApi
} from "@shopify/ui-extensions-react/checkout";

// Set the entry points for the extension
const deliveryAddress = reactExtension("purchase.checkout.delivery-address.render-before", () => <App />);
export { deliveryAddress };

function App() {
  const [data, setData] = useState();
  const {query} = useApi();
  useEffect(() => {
    query(
      `query {
        metaobjects(first: 10, type: "app--244769816577--shipping_messages") {
          nodes {
            id
            fields {
              key
              value
            }
          }
        }
      }`,
    )
      .then(({data, errors}) => setData(data))
      .catch(console.error);
  }, [query]);

  // Create a mapping of province codes to messages
  const provinceMessages = data?.metaobjects?.nodes?.reduce((acc, node) => {
    const stateProvince = node.fields.find(field => field.key === 'state_province')?.value;
    const message = node.fields.find(field => field.key === 'message2')?.value;
    if (stateProvince && message) {
      acc[stateProvince] = message;
    }
    return acc;
  }, {}) || {};
  console.log(provinceMessages);

  // Get the shipping address
  const shippingAddress = useShippingAddress();
  console.log(shippingAddress.provinceCode);

  // Get the message for the current province if it exists
  const message = provinceMessages[shippingAddress.provinceCode] || 'Custom Banner';

  // Render the banner
  return (
    shippingAddress.provinceCode in provinceMessages ? <Banner title={message}></Banner> : null
  );
}
