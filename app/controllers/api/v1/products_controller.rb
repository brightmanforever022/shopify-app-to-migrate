class Api::V1::ProductsController < AuthenticatedController
  include Api::V1::ProductsHelper

  def index
    resps = get_product_variants
    http_success_response(resps)
  end

  def show
    product = get_product(params[:id])
    http_success_response(product)
  end

  def create

  end

  def update
  end

  def destroy
  end

  def load_variant
    variant = get_product_variant
    http_success_response(variant)
  end

  def load_variants
    ids = params[:selecteds].map { |e| "gid://shopify/ProductVariant/#{e}" }
    variants = get_variants_by_ids(ids)
    http_success_response(variants)
  end

  private
    def product_params
      params.except(:controller, :action, :id)
    end

end
