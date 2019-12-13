class Api::Frontend::ProductsController < Api::Frontend::BaseController

  def show
    id = params[:id]
    @shop.connect
    product = get_product(id)
    template_ids = Variant.where(shopify_product_id: id).pluck(:template_id).uniq
    templates = @shop.templates.where(id: template_ids)
    render json: {
      product: product,
      templates: templates
    },
    include: {
      variants: {},
      groups: {
        include: {
          dattributes: {
            except: [:created_at, :updated_at]
          }
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
          options(first: 10) {
            id
            name
            position
            values
          }
          totalInventory
          variants(first: 100) {
            edges {
              cursor
              node {
                id
                availableForSale
                inventoryQuantity
                price
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
