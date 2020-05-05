class Api::Frontend::CartsController < Api::Frontend::BaseController
  require 'fedex'
  require 'json'

  def index
    
  end

  def create
        
  end

  def update
    
  end

  def fedex_options_list
    zipCode = cart_params[:cart][:zipCode]
    lineItemList = cart_params[:cart][:lineItems] ? cart_params[:cart][:lineItems] : []
    
    shipping_options = {
      :packaging_type => "YOUR_PACKAGING",
      :drop_off_type => "REGULAR_PICKUP"
    }

    fedex = Fedex::Shipment.new(
      :key => 'VdEPZewybWZInKdc',
      :password => 'fXAfdUUqWo5mlukgPsdAcvQ7P',
      :account_number => '193784437',
      :meter => '251121044',
      :mode => 'production'
    )

    recipient = {
      :name => "Test Fedex Recipient",
      :company => "Home",
      :postal_code => zipCode,
      :country_code => "US",
      :residential => "true"
    }
    
    # packages = []
    shippingMarkup = 0.0
    lineRateList = {
      ground: 0.0,
      nextday: 0.0,
      twoday: 0.0,
      threeday: 0.0,
      shippingMarkup: 0.0,
    }

    lineItemList.each do |lineItem|
      isFreight = false
      lineItem[:custom_options].each do |cop|
        if cop[:freight]
          isFreight = true
        end
      end
      
      if lineItem[:is_freight]
        isFreight = true
      end
      
      if !isFreight
        shippingMarkup = 0
        packages = []
        lineItem[:custom_options].each do |co|
          shipper = {
            :name => "Test Fedex Sender",
            :company => "Home",
            :postal_code => co[:postal_code].to_i,
            :country_code => "US"
          }

          if co[:weight] > 0
            # packages << {
            #   :weight => {:units => "LB", :value => co[:weight]},
            #   :dimensions => {:length => co[:length], :width => co[:width], :height => co[:girth], :units => "IN"}
            # }
            # shippingMarkup += lineItem.calculated_price * lineItem.markupPercent / 100
            shippingMarkup += lineItem[:calculated_price] * 5 / 100
            lineRate = get_rates_list([{
                :weight => {:units => "LB", :value => co[:weight] * 2.2},
                :dimensions => {:length => co[:length], :width => co[:width], :height => co[:girth], :units => "IN"}
              }], shipper, recipient, shipping_options, fedex)
            
            lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
            lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
            lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
            lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
          end
          if co[:weight2] > 0
            shippingMarkup += lineItem[:calculated_price] * 5 / 100
            lineRate = get_rates_list([{
                :weight => {:units => "LB", :value => co[:weight2] * 2.2},
                :dimensions => {:length => co[:length2], :width => co[:width2], :height => co[:girth2], :units => "IN"}
              }], shipper, recipient, shipping_options, fedex)
            
            lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
            lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
            lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
            lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
          end
          if co[:weight3] > 0
            shippingMarkup += lineItem[:calculated_price] * 5 / 100
            lineRate = get_rates_list([{
                :weight => {:units => "LB", :value => co[:weight3] * 2.2},
                :dimensions => {:length => co[:length3], :width => co[:width3], :height => co[:girth3], :units => "IN"}
              }], shipper, recipient, shipping_options, fedex)
            
            lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
            lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
            lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
            lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
          end
          if co[:weight4] > 0
            shippingMarkup += lineItem[:calculated_price] * 5 / 100

            lineRate = get_rates_list([{
                :weight => {:units => "LB", :value => co[:weight4] * 2.2},
                :dimensions => {:length => co[:length4], :width => co[:width4], :height => co[:girth4], :units => "IN"}
              }], shipper, recipient, shipping_options, fedex)
            
            lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
            lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
            lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
            lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
          end
          if co[:weight5] > 0
            shippingMarkup += lineItem[:calculated_price] * 5 / 100

            lineRate = get_rates_list([{
                :weight => {:units => "LB", :value => co[:weight5] * 2.2},
                :dimensions => {:length => co[:length5], :width => co[:width5], :height => co[:girth5], :units => "IN"}
              }], shipper, recipient, shipping_options, fedex)
            
            lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
            lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
            lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
            lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
          end
          if co[:weight6] > 0
            shippingMarkup += lineItem[:calculated_price] * 5 / 100

            lineRate = get_rates_list([{
                :weight => {:units => "LB", :value => co[:weight6] * 2.2},
                :dimensions => {:length => co[:length6], :width => co[:width6], :height => co[:girth6], :units => "IN"}
              }], shipper, recipient, shipping_options, fedex)
            
            lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
            lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
            lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
            lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
          end

        end

        lineRateList[:shippingMarkup] += shippingMarkup
      end
    end
    http_success_response({
      ground: lineRateList[:ground].round(2),
      nextday: lineRateList[:nextday].round(2),
      twoday: lineRateList[:twoday].round(2),
      threeday: lineRateList[:threeday].round(2),
      shippingMarkup: lineRateList[:shippingMarkup].round(2),
    })
  end

  def freight_options
    freightoptions = @shop.freightoptions
    http_success_response({ freightoptions: freightoptions })
  end

  private
    def cart_params
      params.except(:controller, :action, :id)
    end

    def get_rates_list(packages, shipper, recipient, shipping_options, fedexInstance)
      if packages.length() > 0
        rateGround = fedexInstance.rate(
          :shipper=>shipper,
          :recipient => recipient,
          :packages => packages,
          :service_type => "FEDEX_GROUND",
          :shipping_options => shipping_options
        )
        rateNextDay = fedexInstance.rate(
          :shipper=>shipper,
          :recipient => recipient,
          :packages => packages,
          :service_type => "STANDARD_OVERNIGHT",
          :shipping_options => shipping_options
        )
        rateTwoDay = fedexInstance.rate(
          :shipper=>shipper,
          :recipient => recipient,
          :packages => packages,
          :service_type => "FEDEX_2_DAY",
          :shipping_options => shipping_options
        )
        
        rateThreeDay = fedexInstance.rate(
          :shipper=>shipper,
          :recipient => recipient,
          :packages => packages,
          :service_type => "FEDEX_EXPRESS_SAVER",
          :shipping_options => shipping_options
        )

        puts "------------------rateNextDay rate: #{rateNextDay}"
        rateGroundData = JSON.parse(rateGround[0].to_json)
        rateNextDayData = JSON.parse(rateNextDay[0].to_json)
        rateTwoDayData = JSON.parse(rateTwoDay[0].to_json)
        rateThreeDayData = JSON.parse(rateThreeDay[0].to_json)
        
        return {
          rateGround: rateGroundData['total_net_charge'],
          rateNextDay: rateNextDayData['total_net_charge'],
          rateTwoDay: rateTwoDayData['total_net_charge'],
          rateThreeDay: rateThreeDayData['total_net_charge'],
        }
      else
        return {
          rateGround: 0,
          rateTwoDay: 0,
          rateThreeDay: 0,
          rateNextDay: 0,
        }
      end
    end
end
