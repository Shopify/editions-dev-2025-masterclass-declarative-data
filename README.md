# Editions.dev 2025 - Declarative custom data and the new `app dev`

## Module 0: Setup

* Create app
* Create dev store
* Run `dev`
* Optional: Share app / `link` with your team

## Module 1: How to use CDA in UI extensions
A Checkout UI shipping message / [delivery banner](https://shopify.dev/docs/api/checkout-ui-extensions/2025-04/targets/shipping/purchase-checkout-delivery-address-render-before) that displays based on the entered postal code or state/province

* Create the schema (start minimally) 
 * Viewing it in the Admin
 * Adding values
  * What happens when `dev` ends
  * What happens when you `dev clean`
* Using metaobjects in a UI extension
  * Build incrementally / add the schema
  * Discuss validation rules; features; capabilities 

## Module 2: How to use CDA in Functions

* Using metafield in a Function
* A product metafield that allows configuring the max purchase amount for a product (enforced by Validation function)
  * Bonus: a customer metafield that allows exceeding that
 
## Schema

### Metaobject - Shipping messages

* State/province code - `state_province` - `single_line_text_field`
  * Validation - choices, required
* Shipping message - `shipping_message` - `rich_text`
  * Validation - required
* Start time - `start` - `date_time`
* End time - `end` - `date_time`

### Metafield - product max purchase

* Max quantity - `max_quantity` - `number_integer`
* Max quantity message - `max_quantity_message` - `single_line_text_field`

### Metafield - customer max purchase override

* Allow purchase - `allow_purchase_over_max` - `boolean`
