module Shopify
  class AfterAuthenticateJob < ActiveJob::Base
    def perform(shop_domain:)
      shop = Shop.find_by(shopify_domain: shop_domain)

      shop.with_shopify_session do
        @themes = ShopifyAPI::Theme.all
        ac = ActionController::Base.new()
        @customize_snippet_string = ac.render_to_string(
            :template => 'snippets/d4s-custom',
            :layout => false,
            :locals => {
              :token => shop.api_key
            }
          )
        @themes.map do |theme|
          ShopifyAPI::Asset.create(
            key: 'snippets/d4s-custom.liquid',
            value: @customize_snippet_string, theme_id: theme.id
          )
        end
      end
    end
  end
end
