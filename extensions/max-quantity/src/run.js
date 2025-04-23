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
  const allowPurchaseOverMax = Boolean(input.cart.buyerIdentity?.customer?.allowPurchaseOverMax?.value) ?? false;
  if (allowPurchaseOverMax) {
    return {
      errors: [],
    }
  }

  const errors = input.cart.lines
    .filter(({ quantity, merchandise }) => {
      if (merchandise.__typename !== "ProductVariant") {
        return false;
      }
      
      const maxQuantityValue = merchandise.product?.maxQuantity?.value;
      if (!maxQuantityValue) {
        return false;
      }

      return quantity > parseInt(maxQuantityValue);
    })
    .map(({ merchandise }) => {

      let localizedMessage = "Not possible to order more than one of each";

      if (merchandise.__typename == "ProductVariant") {
        if (merchandise.product?.maxQuantityMessage?.value) {
          localizedMessage = merchandise.product.maxQuantityMessage.value;
        }
      }

      return {
        localizedMessage,
        target: "$.cart",
      }
    });

  return {
    errors
  }
};