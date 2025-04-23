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