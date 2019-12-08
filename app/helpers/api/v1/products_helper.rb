module Api::V1::ProductsHelper

  def get_product product_id
    ShopifyGraphQLClient.client.allow_dynamic_queries = true
    result = ShopifyGraphQLClient.query(ShopifyGraphQLClient.parse(product_query(product_id)))
    result.data.product
  end

  def product_query product_id
    query = 'id: "gid://shopify/Product/' + product_id.to_s + '"'
    "{
      product(#{query}) {
        id
        featuredImage {
          transformedSrc(maxWidth: 100, maxHeight: 100)
        }
        title
        handle
      }
    }"
  end

  def get_variants_by_ids ids
    ShopifyGraphQLClient.client.allow_dynamic_queries = true
    result = ShopifyGraphQLClient.query(ShopifyGraphQLClient.parse(variants_by_ids_query(ids)))
    result.data
  end

  def variants_by_ids_query ids
    query = 'ids: ' + "#{ids}" + ''
    "{
      nodes(#{query}) {
        ... on ProductVariant {
          image(maxWidth: 100, maxHeight: 100) {
            src
          }
          displayName
          inventoryQuantity
          price
          title
          sku
          product {
            id
            title
            featuredImage {
              transformedSrc(maxWidth: 100, maxHeight: 100)
            }
          }
          id
        }
      }
    }"
  end
end
