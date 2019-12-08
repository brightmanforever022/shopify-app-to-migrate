ShopifyApp.configure do |config|
  config.application_name = "Displays4Sale Order app"
  config.api_key = ENV['SHOPIFY_API_KEY']
  config.secret = ENV['SHOPIFY_API_SECRET']
  config.old_secret = ""
  config.scope = "read_products,write_products,read_themes,write_themes,read_customers,write_customers,write_draft_orders,read_draft_orders,read_orders,write_orders,read_price_rules" # Consult this page for more scope options:
                                 # https://help.shopify.com/en/api/getting-started/authentication/oauth/scopes
  config.embedded_app = true
  config.api_version = ENV['SHOPIFY_API_VERSION']
  config.session_repository = Shop
  config.after_authenticate_job = { job: "Shopify::AfterAuthenticateJob", inline: false }
end
