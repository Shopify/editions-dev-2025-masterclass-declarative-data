# Module 2: Using declarative metafield definitions

## Customize product limits with a metafield

1. `shopify app dev --use-localhost`
1. Add product metafields for defining a max purchase quantity and messaging on products.

    ```toml
    [product.metafields.app.max_purchase_quantity]
    type = "number_integer"
    validations.min = 0
    access.admin = "merchant_read_write"

    [product.metafields.app.max_quantity_message]
    type = "single_line_text_field"
    access.admin = "merchant_read_write"
    ```

1. Add needed scopes as prompted
    * `write_products`
1. Pick a product in admin and open its metafields.
    * These don't look great! Let's add a `name`.
        ```toml
        # in [product.metafields.app.max_purchase_quantity]
        name = "Max Purchase Quantity"

        # in [product.metafields.app.max_quantity_message]
        name = "Max Quantity Message"
        ```

    * Refresh and populate metafields
1. `shopify app generate extension`
    * Extension type: `Cart and checkout validation - Function`
    * Name: `max-quantity`
    * Use Rust if you are comfortable, but JavaScript is fine for dev/prototyping.
1. Activate the function via Checkout Settings, and test on your Storefront
    * Out of the box, it should prevent product quantities > 1.
    * Review logs in `app dev` output
1. Update the function to use the metafield
    * Update the [input query](../extensions/max-quantity/src/run.graphql) to fetch the metafield

        ```graphql
        query RunInput {
        cart {
            lines {
            quantity
            merchandise {
                __typename
                ... on ProductVariant {
                product {
                    maxQuantity: metafield(namespace: "$app", key: "max_purchase_quantity") {
                    value
                    }
                    maxQuantityMessage: metafield(namespace: "$app", key: "max_quantity_message") {
                    value
                    }
                }
                }
            }
            }
        }
        }
        ```

    * Update the [function code](../extensions/max-quantity/src/run.js) to use the value and message

    ```js
    // @ts-check

    /**
    * @typedef {import("../generated/api").RunInput} RunInput
    * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
    */

    /**
    * @param {RunInput} input
    * @returns {FunctionRunResult}
    */
    export function run(input) {

    const errors = input.cart.lines
        .flatMap(({ quantity, merchandise }) => {
        if (merchandise.__typename !== "ProductVariant") {
            return [];
        }
        
        const maxQuantityValue = merchandise.product?.maxQuantity?.value;
        if (!maxQuantityValue) {
            return [];
        }

        if (quantity <= parseInt(maxQuantityValue)) {
            return [];
        }

        const localizedMessage = 
            merchandise.product?.maxQuantityMessage?.value ??
            "Not possible to order more than one of each";

        return [{
            localizedMessage,
            target: "$.cart",
        }];
        });

    return {
        errors
    }
    };
    ```

    * Test the new function logic
    * Review logs in `app dev` output


## BONUS: Add customer override
1. Add a customer metafield allowing purchase over the max

    ```toml
    [customer.metafields.app.allow_purchase_over_max]
    name = "Allow Purchase Over Max"
    type = "boolean"
    access.admin = "merchant_read_write"
    access.customer_account = "read"
    ```

1. Add needed scopes as prompted
    * `write_customers`
1. Create a customer for yourself in admin
1. Open customer and view metafields, select True.
1. Update the function to use the metafield
    * Update the input query to fetch the metafield

        ```graphql
        buyerIdentity {
        customer {
            allowPurchaseOverMax: metafield(namespace: "$app", key: "allow_purchase_over_max") {
            value
            }
        }
        }
        ```

    * Update function logic to early return for these customers

        ```js
        const allowPurchaseOverMax = Boolean(input.cart.buyerIdentity?.customer?.allowPurchaseOverMax?.value) ?? false;
        if (allowPurchaseOverMax) {
            return {
            errors: [],
            }
        }
        ```

    * Log in on your store
    * Test the new function logic
    * Review logs in `app dev` output
