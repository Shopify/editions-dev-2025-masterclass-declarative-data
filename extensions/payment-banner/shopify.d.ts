import '@shopify/ui-extension';

//@ts-ignore
declare module './src/Checkout.jsx' {
  const shopify: import('@shopify/ui-extensions/purchase.checkout.payment-method-list.render-before').Api;
  const globalThis: { shopify: typeof shopify };
}
