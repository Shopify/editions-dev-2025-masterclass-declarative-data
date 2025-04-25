
## Customize product limits with a metafield

1. `shopify app dev`
1. Add metafields:
    * max_purchase_quantity
    * max_quantity_message
2. Add needed scopes
    * `write_products`
    * `write_customers`
1. Find a product, oops the names suck
    * Go back and add `name`
    * Refresh and populate metafields
1. `shopify app generate extension`
    * `Cart and checkout validation - Function`
    * `max-quantity`
    * Use Rust if comfortable, but JavaScript is fine for dev/prototyping.
1. Activate and test the function
    * Review logs in `app dev` output
1. Update the function to use the metafield
    * TODO: Why isn't the GraphQL Language Server working?
    * Update the input query to fetch the metafield
    * Update the function code to use the value and message
    * Test the new function logic
    * Review logs in `app dev` output


## Add customer override
1. Create a customer for yourself in admin
1. Add allow_purchase_over_max
1. Open customer and view metafields, select True 
1. Update the function to use the metafield
    * Update the input query to fetch the metafield
    * Update function logic to early return
    * Log in on your store
    * Test the new function logic
    * Review logs in `app dev` output
    * TODO: Follow up w/ Checkout team on what happens when you log out (can't remove cart items)
