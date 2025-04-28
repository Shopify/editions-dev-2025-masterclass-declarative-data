# Module 1: Using declarative metaobject definitions

## Creating your first definition

1. Run `shopify app dev`
1. Create a `metaobjects.app.payment_messages` metaobject definition. Fields:

   ```toml
   [metaobjects.app.payment_messages.fields.payment_type]
   name = "Payment Type"
   type = "single_line_text_field"
   required = true

   [metaobjects.app.payment_messages.fields.message]
   name = "Message"
   type = "single_line_text_field"
   required = true
   ```

1. Check your terminal to see what's happened when we added these.
    * Notice error in the terminal. That's right - we now flag which scopes are missing!
1. Add `write_metaobject_definitions` scope. Success!
   * **PRE-EDITIONS:** You might need to accept the scope.
1. Open GraphiQL from Shopify CLI (`g`), you can query your metaobject definitions here.

   ```gql
   query getMetaobjectDefinitions {
      metaobjectDefinitions(first: 10) {
         nodes {
            id
         }
      }
   }
   ```
1. Add the `write_metaobjects` access scope
   * **PRE-EDITIONS:** You might need to accept the scope.
1. Add a metaobject via GraphiQL

   ```gql
   mutation createMetaobject {
      metaobjectCreate(metaobject:{
         type: "$app:payment_messages",
         fields: [
            {
            key: "payment_type",
            value: "creditCard"
            },
            {
            key: "message",
            value: "Lorem ipsum credit card dolor sit amet, consectetur."
            }
         ]
      }) {
         userErrors {
            message
         }
         metaobject {
            id
            type
            fields {
            key
            value
            }
         }
      }
   }
   ```

## Use the metaobject to create a payment banner in Checkout
1. Run `POLARIS_UNIFIED=true shopify app generate extension`
   * Select `Checkout UI`
   * Give your extension a name
2. Create a simple hardcoded banner
   1. Use `purchase.checkout.payment-method-list.render-before` as the target
     * Update this in `shopify.extension.toml`
   2. Open the extension via Shopify CLI and the Developer Console (`p`).
      * Confirm the banner displays above the payment method list
3. Update the code to fetch the metaobject you created via the Storefront API and use it as a banner message. Display the banner if the payment type is selected.
   * [Code](../extensions/payment-banner/src/Checkout.jsx)
4. BONUS: Add more payment methods via admin and metaobjects via GraphiQL. Change the payment type for other banners based on values [in `PaymentOption` documentation](https://shopify.dev/docs/api/checkout-ui-extensions/2025-04/apis/payments#useAvailablePaymentOptions-returns)

## Allow merchants to add their own values
1. Navigate to your store. Go to Settings > Custom Data, then More Actions > View app-controlled Metaobjects. Notice the new `payment_messages` definition is here too. Let's make them editable and more human-friendly.
1. Add `merchant_read_write` to the metaobject definition

   ```toml
      [metaobjects.app.payment_messages.access]
      admin = "merchant_read_write"
      storefront = "public_read"
   ```

1. Add a `choices` validation to `payment_type`

   ```toml
     [metaobjects.app.payment_messages.fields.payment_type.validations]
     choices = [
        "creditCard", "deferred", "local", "manualPayment", "offsite", "other", "paymentOnDelivery", "redeemable", "wallet", "customOnsite"
     ]
   ```

1. Add a metaobject via Admin
1. Test your new banner in Checkout