class Api::Frontend::CartsController < Api::Frontend::BaseController
  require 'fedex'

  def index
    
  end

  def create
        
  end

  def update
    
  end

  def fedex_options_list
    puts "fedex parameters: #{cart_params[:cart]}"
    shipper = { 
      :name => "Test Fedex Sender",
      :company => "Home",
      :phone_number => "121-333-2332",
      :address => "Main Street",
      :city => "Littleton",
      :state => "CO",
      :postal_code => "80125",
      :country_code => "US" 
    }
    
    recipient = { 
      :name => "Test Fedex Recipient",
      :company => "Home",
      :phone_number => "555-555-5555",
      # :address => "Main Street",
      # :city => "Boulder",
      # :state => "CO",
      :postal_code => "93221",
      :country_code => "US",
      :residential => "false"
    }

    packages = []
    packages << {
      :weight => {:units => "LB", :value => 2},
      :dimensions => {:length => 10, :width => 5, :height => 4, :units => "IN" }
    }
    packages << {
      :weight => {:units => "LB", :value => 6},
      :dimensions => {:length => 5, :width => 5, :height => 4, :units => "IN" }
    }
    shipping_options = {
      :packaging_type => "YOUR_PACKAGING",
      :drop_off_type => "REGULAR_PICKUP"
    }

    fedex = Fedex::Shipment.new(
      :key => 'h8cacZZYQvu7iebt',
      :password => 'SJ8UjWWR5ylk1NOUNEZGrllFW',
      :account_number => '510087240',
      :meter => '114043658',
      :mode => 'development'
    )
      
    serviceAvailability = fedex.service_availability()
    puts "available services: #{serviceAvailability}"

    rate = fedex.rate(
      :shipper=>shipper,
      :recipient => recipient,
      :packages => packages,
      :service_type => "FEDEX_GROUND",
      # :service_type => "FEDEX_2_DAY",
      :shipping_options => shipping_options
    )
    puts "rate: #{rate}"
        
    # http_success_response(cart_params[:cart])
    http_success_response(rate)
  end

  private
    def cart_params
      params.except(:controller, :action, :id)
    end

end
