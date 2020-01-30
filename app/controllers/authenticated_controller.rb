# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::Authenticated

  before_action :set_shop

  def set_shop
    if Rails.env.production?
      @shop = Shop.where(shopify_domain: session[:shopify_domain]).take
    else
      @shop = Shop.find_by_shopify_domain('displays4sale.myshopify.com')
      @shop.connect if @shop.present?
    end
  end
end
