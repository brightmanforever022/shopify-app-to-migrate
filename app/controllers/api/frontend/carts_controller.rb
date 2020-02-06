class Api::Frontend::CartsController < Api::Frontend::BaseController
  require 'fedex'

  def index
    
  end

  def create
        
  end

  def update
    
  end

  def fedex_options_list
    # puts "fedex parameters: #{cart_params[:cart]}"
    zipCode = cart_params[:cart][:zipCode]
    lineItemList = cart_params[:cart][:lineItems] ? cart_params[:cart][:lineItems] : []

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
      :residential => "true"
    }

    packages = []
    shippingMarkup = 0
    lineItemList.each do |lineItem|
      lineItem.custom_options.each do |co|
        if co.weight > 0
          packages << {
            :weight => {:units => "LB", :value => co.weight},
            :dimensions => {:length => co.length, :width => co.width, :height => co.height, :units => "IN"}
          }
          # shippingMarkup += lineItem.calculated_price * lineItem.markupPercent / 100
          shippingMarkup += lineItem.calculated_price * 5 / 100
        end
        if co.weight2 > 0
          packages << {
            :weight => {:units => "LB", :value => co.weight2},
            :dimensions => {:length => co.length2, :width => co.width2, :height => co.height2, :units => "IN"}
          }
        end
        if co.weight3 > 0
          packages << {
            :weight => {:units => "LB", :value => co.weight3},
            :dimensions => {:length => co.length3, :width => co.width3, :height => co.height3, :units => "IN"}
          }
        end
      end
    end
    # packages << {
    #   :weight => {:units => "LB", :value => 1},
    #   :dimensions => {:length => 10, :width => 5, :height => 4, :units => "IN" }
    # }
    # packages << {
    #   :weight => {:units => "LB", :value => 1},
    #   :dimensions => {:length => 5, :width => 5, :height => 4, :units => "IN" }
    # }
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
    
    rateNextDay = fedex.rate(
      :shipper=>shipper,
      :recipient => recipient,
      :packages => packages,
      :service_type => "STANDARD_OVERNIGHT",
      :shipping_options => shipping_options
    )
    rateGround = fedex.rate(
      :shipper=>shipper,
      :recipient => recipient,
      :packages => packages,
      :service_type => "FEDEX_GROUND",
      :shipping_options => shipping_options
    )

    rateTwoDay = fedex.rate(
      :shipper=>shipper,
      :recipient => recipient,
      :packages => packages,
      :service_type => "FEDEX_2_DAY",
      :shipping_options => shipping_options
    )
    
    rateThreeDay = fedex.rate(
      :shipper=>shipper,
      :recipient => recipient,
      :packages => packages,
      :service_type => "FEDEX_EXPRESS_SAVER",
      :shipping_options => shipping_options
    )
    
    http_success_response({
      rateGround: rateGround,
      rateTwoDay: rateTwoDay,
      rateThreeDay: rateThreeDay,
      rateNextDay: rateNextDay,
      shippingMarkup: shippingMarkup,
    })
  end

  private
    def cart_params
      params.except(:controller, :action, :id)
    end

end
