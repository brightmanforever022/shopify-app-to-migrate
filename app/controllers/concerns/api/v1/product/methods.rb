module Api
  module V1
    module Product
      module Methods
        extend ActiveSupport::Concern

        included do

          private
            def get_product_variants
              ShopifyGraphQLClient.client.allow_dynamic_queries = true
              result = ShopifyGraphQLClient.query(ShopifyGraphQLClient.parse(variants_query))
              result.data.product_variants
            end

            def get_product_variant
              ShopifyGraphQLClient.client.allow_dynamic_queries = true
              result = ShopifyGraphQLClient.query(ShopifyGraphQLClient.parse(variant_query))
              result.data.product_variant
            end

            def get_products
              ShopifyGraphQLClient.client.allow_dynamic_queries = true
              result = ShopifyGraphQLClient.query(ShopifyGraphQLClient.parse(products_query))
              result.data.products
            end

            def index_query
              if params[:direction] == 'prev'
                query = 'last: 20, before:' '"' + "#{params[:cursor]}" + '"'
              elsif params[:direction]  == 'next'
                query = 'first: 20, after:' '"' + "#{params[:cursor]}" + '"'
              else
                query = 'first: 20'
              end
              if params[:queryValue].present?
                query = query + ', query: "' + params[:queryValue] + '*"'
              end
              query
            end

            def variant_query
              query = 'id: "gid://shopify/ProductVariant/' + params[:id] + '"'
              "{
                productVariant(#{query}) {
                  image(maxWidth: 100, maxHeight: 100) {
                    src
                  }
                  displayName
                  inventoryQuantity
                  price
                  title
                  sku
                  product {
                    title
                    featuredImage {
                      altText
                      src
                      id
                    }
                  }
                  id
                }
              }"
            end

            def variants_query
              "{
                productVariants(#{index_query}) {
                  edges {
                    node {
                      id
                      image(maxWidth: 50, maxHeight: 50) {
                        src
                      }
                      product {
                        title
                        id
                        featuredImage {
                          altText
                          src
                        }
                      }
                      displayName
                      price
                      selectedOptions {
                        name
                        value
                      }
                      title
                      sku
                      inventoryQuantity
                    }
                    cursor
                  }
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                  }
                }
              }"
            end

            def products_query
              "{
                products(#{index_query}) {
                  edges {
                    node {
                      featuredImage {
                        transformedSrc(maxWidth: 100, maxHeight: 100)
                      }
                      id
                      title
                      handle
                      totalInventory
                      priceRange {
                        minVariantPrice {
                          currencyCode
                          amount
                        }
                        maxVariantPrice {
                          currencyCode
                          amount
                        }
                      }
                    }
                    cursor
                  }
                  pageInfo {
                    hasNextPage
                    hasPreviousPage
                  }
                }
              }"
            end
        end
      end
    end
  end
end
