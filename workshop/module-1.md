## Creating your first definition

1. Create `metaobjects.app.shipping_messages` definition. Fields:
    * state_province
    * message
2. Run `shopify app dev`
    * Notice error in the terminal. That's right - we now flag which scopes are missing!
3. Add `write_metaobject_definitions` scope. Run `shopify app dev` again. Success!
4. Navigate to your store. Go to Settings -> Custom Data, then More Actions > View app-controlled Metaobjects. Notice the new `Shipping Message` definition
5. Add a metaobject via GraphiQL

## Use definition to create a delivery banner in Checkout
1. Run `shopify app generate extension`
   * Select `Checkout UI`
   * Give your extension a name
   * Select Javascript React
2. Create a simple hardcoded banner
   1. Use `purchase.checkout.delivery-address.render-before` as the target
   2. Code at /workshop/step2-2
3. Fetch the metaobject you created in the previous module via the Storefront API. Update logic to display the banner if the shipping address matches the state_province field
   1. Code at /workshop/step2-3
4. BONUS: Add more metaobjects via GraphiQL. Change the provinceCode for other banners

## Allow merchants to add their own values
1. Add `access.admin = "merchant_read_write"` to the metaobject definition
2. Use longhand for state_province and message. Use name to create a human readable name, and make the fields required
3. Add optional start_time and end_time fields. Give them human readable names
4. Add validation.choices to state_province
5. Update code to work with start date and time
6. BONUS