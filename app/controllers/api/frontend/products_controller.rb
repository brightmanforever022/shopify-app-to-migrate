class Api::Frontend::ProductsController < Api::Frontend::BaseController

  def show
    id = params[:id]
    @shop.connect
    product = get_product(id)
    # template_ids = Variant.where(shopify_product_id: id).pluck(:template_id).uniq
    # templates = @shop.templates.where(id: template_ids)
    template = @shop.templates.where(shopify_product_id: id).limit(1)
    render json: {
      product: product,
      template: template
    },
    include: {
      # variants: {},
      groups: {
        include: {
          dattributes: {
            except: [:created_at, :updated_at]
          },
          drellations: {}
        }
      }
    }
  end

  private

    def get_product id
      ShopifyGraphQLClient.client.allow_dynamic_queries = true
      result = ShopifyGraphQLClient.query(ShopifyGraphQLClient.parse(product_query(id)))
      result.data.product
    end
    def product_query product_id
      query = 'id: "gid://shopify/Product/' + product_id.to_s + '"'
      "{
        product(#{query}) {
          defaultCursor
          handle
          id
          title
          tags
          onlineStoreUrl
          collections(first: 5) {
            edges {
              node {
                id
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
          options(first: 2) {
            id
            name
            position
            values
          }
          totalInventory
          variants(first: 2) {
            edges {
              cursor
              node {
                id
                availableForSale
                inventoryQuantity
                price
                sku
                selectedOptions {
                  value
                  name
                }
              }
            }
          }
        }
      }"
    end

end
