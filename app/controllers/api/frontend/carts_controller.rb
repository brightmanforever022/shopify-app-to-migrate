class Api::Frontend::CartsController < Api::Frontend::BaseController
  require 'fedex'
  require 'json'

  before_action :set_settings, only: [:fedex_options_list]

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
    isVolume = 0
    lineRateList = {
      ground: 0.0,
      nextday: 0.0,
      twoday: 0.0,
      threeday: 0.0,
      isVolume: 0,
      isBeyond: 0,
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
        discountPercent = getDiscountByQuantity(lineItem[:shipping_summary], lineItem[:quantity]) / 100
        lineItem[:custom_options].each do |co|
          shipPercentCase = 0
          shipper = {
            :name => "Test Fedex Sender",
            :company => "Home",
            :postal_code => co[:postal_code].to_i,
            :country_code => "US"
          }

          # shipPercentCase Value List
          # 0: there are no shipping discount rule, 1: call fedex api, 
          # 2: shipping price is subtotal * ship_price_percent / 100, Only ground rate is stored, others should be null.
          # 3: call fedex api and notify some sentence

          if co[:weight] > 0
            shipPercentCase = get_ship_percent_case(lineItem[:quantity].to_i, co)
            lineRateList[:isVolume] += shipPercentCase == 2 ? 1 : 0
            lineRateList[:isBeyond] += shipPercentCase == 3 ? 1 : 0
            if shipPercentCase != 2
              lineRate = get_rates_list([{
                  :weight => {:units => "LB", :value => co[:weight]},
                  :dimensions => {:length => co[:length], :width => co[:width], :height => co[:girth], :units => "IN"}
                }], shipper, recipient, shipping_options, fedex)
              
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
              lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
              lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
              lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
            else
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : (1 - discountPercent) * lineItem[:calculated_price].to_f * co[:ship_price_percent] / 10000 * (@settings.shipping_markup + 100)
            end
          end
          if co[:weight2] > 0
            shipPercentCase = get_ship_percent_case(lineItem[:quantity].to_i, co)
            lineRateList[:isVolume] += shipPercentCase == 2 ? 1 : 0
            lineRateList[:isBeyond] += shipPercentCase == 3 ? 1 : 0
            if shipPercentCase != 2
              lineRate = get_rates_list([{
                  :weight => {:units => "LB", :value => co[:weight2]},
                  :dimensions => {:length => co[:length2], :width => co[:width2], :height => co[:girth2], :units => "IN"}
                }], shipper, recipient, shipping_options, fedex)
              
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
              lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
              lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
              lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
            else
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : (1 - discountPercent) * lineItem[:calculated_price].to_f * co[:ship_price_percent] / 10000 * (@settings.shipping_markup + 100)
            end
          end
          if co[:weight3] > 0
            shipPercentCase = get_ship_percent_case(lineItem[:quantity].to_i, co)
            lineRateList[:isVolume] += shipPercentCase == 2 ? 1 : 0
            lineRateList[:isBeyond] += shipPercentCase == 3 ? 1 : 0
            if shipPercentCase != 2
              lineRate = get_rates_list([{
                  :weight => {:units => "LB", :value => co[:weight3]},
                  :dimensions => {:length => co[:length3], :width => co[:width3], :height => co[:girth3], :units => "IN"}
                }], shipper, recipient, shipping_options, fedex)
              
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
              lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
              lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
              lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
            else
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : (1 - discountPercent) * lineItem[:calculated_price].to_f * co[:ship_price_percent] / 10000 * (@settings.shipping_markup + 100)
            end
          end
          if co[:weight4] > 0
            shipPercentCase = get_ship_percent_case(lineItem[:quantity].to_i, co)
            lineRateList[:isVolume] += shipPercentCase == 2 ? 1 : 0
            lineRateList[:isBeyond] += shipPercentCase == 3 ? 1 : 0
            if shipPercentCase != 2
              lineRate = get_rates_list([{
                  :weight => {:units => "LB", :value => co[:weight4]},
                  :dimensions => {:length => co[:length4], :width => co[:width4], :height => co[:girth4], :units => "IN"}
                }], shipper, recipient, shipping_options, fedex)
              
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
              lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
              lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
              lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
            else
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : (1 - discountPercent) * lineItem[:calculated_price].to_f * co[:ship_price_percent] / 10000 * (@settings.shipping_markup + 100)
            end
          end
          if co[:weight5] > 0
            shipPercentCase = get_ship_percent_case(lineItem[:quantity].to_i, co)
            lineRateList[:isVolume] += shipPercentCase == 2 ? 1 : 0
            lineRateList[:isBeyond] += shipPercentCase == 3 ? 1 : 0
            if shipPercentCase != 2
              lineRate = get_rates_list([{
                  :weight => {:units => "LB", :value => co[:weight5]},
                  :dimensions => {:length => co[:length5], :width => co[:width5], :height => co[:girth5], :units => "IN"}
                }], shipper, recipient, shipping_options, fedex)
              
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
              lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
              lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
              lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
            else
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : (1 - discountPercent) * lineItem[:calculated_price].to_f * co[:ship_price_percent] / 10000 * (@settings.shipping_markup + 100)
            end
          end
          if co[:weight6] > 0
            shipPercentCase = get_ship_percent_case(lineItem[:quantity].to_i, co)
            lineRateList[:isVolume] += shipPercentCase == 2 ? 1 : 0
            lineRateList[:isBeyond] += shipPercentCase == 3 ? 1 : 0
            if shipPercentCase != 2
              lineRate = get_rates_list([{
                  :weight => {:units => "LB", :value => co[:weight6]},
                  :dimensions => {:length => co[:length6], :width => co[:width6], :height => co[:girth6], :units => "IN"}
                }], shipper, recipient, shipping_options, fedex)
              
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : lineRate[:rateGround].to_f * lineItem[:quantity].to_i
              lineRateList[:nextday] += lineRate[:rateNextDay].to_f * lineItem[:quantity].to_i
              lineRateList[:twoday] += lineRate[:rateTwoDay].to_f * lineItem[:quantity].to_i
              lineRateList[:threeday] += lineRate[:rateThreeDay].to_f * lineItem[:quantity].to_i
            else
              lineRateList[:ground] += lineItem[:free_ground] ? 0 : (1 - discountPercent) * lineItem[:calculated_price].to_f * co[:ship_price_percent] / 10000 * (@settings.shipping_markup + 100)
            end
          end
        end
      end
    end
    http_success_response({
      ground: lineRateList[:ground].round(2),
      nextday: lineRateList[:nextday].round(2),
      twoday: lineRateList[:twoday].round(2),
      threeday: lineRateList[:threeday].round(2),
      isVolume: lineRateList[:isVolume] > 0 ? 1 : 0,
      isBeyond: lineRateList[:isBeyond] > 0 ? 1 : 0,
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

    def set_settings
      @settings = Settings.first
    end

    def get_ship_percent_case(quantity, opt)
      retCase = 0
      if opt[:ship_price_percent] > 0
        if quantity < opt[:min_ship_quantity]
          retCase = 1
        elsif quantity >= opt[:min_ship_quantity] && quantity <= opt[:max_ship_quantity]
          retCase = 2
        else
          retCase = 3
        end
      end

      return retCase
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

        rateGroundData = JSON.parse(rateGround[0].to_json)
        rateNextDayData = JSON.parse(rateNextDay[0].to_json)
        rateTwoDayData = JSON.parse(rateTwoDay[0].to_json)
        rateThreeDayData = JSON.parse(rateThreeDay[0].to_json)

        # exclude discounts and increase 10%
        
        return {
          rateGround: (rateGroundData['total_surcharges'].to_f + rateGroundData['total_base_charge'].to_f) * (@settings.shipping_markup + 100) / 100,
          rateNextDay: (rateNextDayData['total_surcharges'].to_f + rateNextDayData['total_base_charge'].to_f) * (@settings.shipping_markup + 100) / 100,
          rateTwoDay: (rateTwoDayData['total_surcharges'].to_f + rateTwoDayData['total_base_charge'].to_f) * (@settings.shipping_markup + 100) / 100,
          rateThreeDay: (rateThreeDayData['total_surcharges'].to_f + rateThreeDayData['total_base_charge'].to_f) * (@settings.shipping_markup + 100) / 100,
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

    def getDiscountByQuantity(summary, quantity)
      discountPercent = 0
      shipDuration = ''
      shipPeriodFrom = 0
      shipPeriodTo = 0
    
      summaryLines = summary.split("<newline>")
      summaryLines.each do |summaryLine|
        shippingLineItems = summaryLine.split(',')
        shippingQtyItems = shippingLineItems[0].split(' ')
        shippingQty = shippingQtyItems[1].split('-')
        qtyFrom = shippingQty[0].to_i
        qtyTo = shippingQty[1].to_i
        if quantity >= qtyFrom and quantity <= qtyTo
          shippingLineItems[1]["%"] = ""
          discountPercent = shippingLineItems[1].to_i
          shipDuration = shippingLineItems[2]
          shipPeriod = shippingLineItems[2].split('-')
          shipPeriod[0]["Usually Ships in "] = ""
          shipPeriodFrom = shipPeriod[0].to_i
          shipPeriodTo = shipPeriod[1].to_i
        end
      end

      return discountPercent.to_f
    end
end
