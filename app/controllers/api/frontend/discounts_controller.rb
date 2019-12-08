class Api::Frontend::DiscountsController < Api::Frontend::BaseController

    def show
      @shop.connect
      discountList = get_discount()
      render json: {
        discounts: discountList
      }
    end
  
    private
      def get_discount
        ShopifyGraphQLClient.client.allow_dynamic_queries = true
        result = ShopifyGraphQLClient.query(ShopifyGraphQLClient.parse(discount_query()))
        result.data
      end
      def discount_query
        "{
          priceRules(first: 10) {
            edges {
              node {
                endsAt
                itemEntitlements {
                  products(first: 20) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                  collections(first: 10) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                  productVariants (first: 50) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                  targetAllLineItems
                }
                prerequisiteQuantityRange {
                  greaterThan
                  greaterThanOrEqualTo
                  lessThan
                  lessThanOrEqualTo
                }
                prerequisiteSubtotalRange {
                  greaterThan
                  greaterThanOrEqualTo
                  lessThan
                  lessThanOrEqualTo
                }
                startsAt
                status
                title
                valueV2 {
                  ... on PricingPercentageValue {
                    percentage
                  }
                  ... on MoneyV2 {
                    amount
                  }
                }
              }
            }
          }
        }"
      end
  
  end
  