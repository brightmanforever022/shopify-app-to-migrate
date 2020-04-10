class Shop < ActiveRecord::Base
  include ShopifyApp::SessionStorage
  before_create :set_token
  validates_uniqueness_of :api_key

  has_many :templates, dependent: :destroy
  has_many :freightoptions

  def api_version
    ShopifyApp.configuration.api_version
  end

  def connect
    puts shopify_domain
    ShopifyAPI::Base.clear_session
    session = ShopifyAPI::Session.new(domain: shopify_domain, token: shopify_token, api_version: ENV['SHOPIFY_API_VERSION'])
    ShopifyAPI::Base.activate_session(session)
  end

  def set_token
    self.api_key = generate_token
  end

  private
    def generate_token
      token = SecureRandom.uuid
      token = SecureRandom.uuid while Shop.exists?(api_key: token)
      token
    end

end
