import {useEffect, useState} from 'react';
import {
  reactExtension,
  Banner,
  useSelectedPaymentOptions,
  useApi
} from "@shopify/ui-extensions-react/checkout";

const deliveryAddress = reactExtension("purchase.checkout.payment-method-list.render-before", () => <App />);
export { deliveryAddress };

function App() {
  const [data, setData] = useState();
  const {query} = useApi();

  const paymentMethods = useSelectedPaymentOptions();

  useEffect(() => {
    query(
      `query {
        metaobjects(first: 10, type: "$app:payment_messages") {
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

  const paymentMessages = data?.metaobjects?.nodes?.map(node => {
    const message = {
      id: node.id
    }
    node.fields.forEach(field => {
      message[field.key] = field.value;
    });
    return message;
  });

  const displayMessages = paymentMessages?.filter(message =>
    paymentMethods.findIndex(paymentMethod => message.payment_type === paymentMethod.type) !== -1
  );

  return displayMessages?.map(message => <Banner title={message.message} key={message.id}></Banner>) || null;
}
