import {render} from "preact";
import {useEffect, useState} from 'preact/hooks';
import {useApi, useSelectedPaymentOptions} from "@shopify/ui-extensions/checkout/preact"

export default function() {
  render(<Extension />, document.body)
}

function Extension() {
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
      {
        version: "2025-07"
      }
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

  return displayMessages?.map(message => <s-banner heading={message.message} id={message.id}></s-banner>) || null;
}