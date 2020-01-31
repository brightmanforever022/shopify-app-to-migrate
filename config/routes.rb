Rails.application.routes.draw do
  root :to => 'home#index'
  mount ShopifyApp::Engine, at: '/'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/' => 'home#index'
  get 'templates' => 'home#index'
  get 'templates/new' => 'home#index'
  get 'templates/:id/edit' => 'home#index'
  get 'attributes' => 'home#index'
  get 'attributes/new' => 'home#index'
  get 'attributes/:id/edit' => 'home#index'

  namespace :api do
    namespace :v1 do
      resources :products
      get 'products/variants/load' => 'products#load_variants'
      get 'products/variants/:id' => 'products#load_variant'
      resources :templates
      resources :attributes
      get 'attributes/list/options' => 'attributes#search_options'
      get 'attributes/list/stores' => 'attributes#list_stores'
    end

    namespace :frontend do
      resources :products
      resources :orders
      resources :discounts
    end
  end

  require 'sidekiq/web'
  require 'sidekiq/cron/web'
  mount Sidekiq::Web => '/sidekiq'
end
