class Api::Frontend::OrdersController < Api::Frontend::BaseController
  require 'aws-sdk'

  def create
    @shop.connect
    # getting data from parameters
    items = params[:lineItems]
    discountRule = params[:discountRule]
    freightShipping = params[:orderFreightShipping].to_f
    fedexShipping = params[:orderFedexShipping].to_f
    tax = params[:orderTax]

    # Initialize line item list
    line_items = []
    # Check the discount is valid
    discountValid = self.checkDiscount(discountRule[:startsAt], discountRule[:endsAt])
    if discountValid
      discountTarget = discountRule[:itemEntitlements][:targetAllLineItems]
      discountType = 'fixed_amount'
      discountValue = 0.0
      if discountRule[:valueV2][:percentage].present?
        discountType = 'percentage'
        discountValue = discountRule[:valueV2][:percentage].to_f.abs
      else
        discountType = 'fixed_amount'
        discountValue = discountRule[:valueV2][:amount].to_f.abs
      end
    end

    # Get line item list by params
    subTotal = 0.0
    items.each do |item|
      subTotal += item[:calculated_price]
      # Initialize line item
      line_item = {}
      if discountValid && !discountTarget
        if discountRule[:itemEntitlements][:collections][:edges].length() > 0
          discountRule[:itemEntitlements][:collections][:edges].each do |collectionDiscount|
            item[:collections].each do |lineItemCollection|
              if collectionDiscount[:node][:id].to_s.include?(lineItemCollection)
                line_item = {
                  variant_id: item[:variant_id],
                  quantity: item[:quantity].to_i,
                  applied_discount: {
                    description: 'custom',
                    value_type: discountType,
                    value: discountValue,
                    amount: discountType=='percentage' ? item[:original_price].to_f * item[:quantity].to_i * discountValue / 100 : discountValue,
                    title: 'custom'
                  }
                }
              end
            end
          end
        elsif discountRule[:itemEntitlements][:products][:edges].length() > 0
          discountRule[:itemEntitlements][:products][:edges].each do |productDiscount|
            if productDiscount[:node][:id].include? item[:product_id]
              line_item = {
                variant_id: item[:variant_id],
                quantity: item[:quantity].to_i,
                applied_discount: {
                  description: 'custom',
                  value_type: discountType,
                  value: discountValue,
                  amount: discountType=='percentage' ? item[:original_price].to_f * item[:quantity] * discountValue / 100 : discountValue,
                  title: 'custom'
                }
              }
            end
          end
        else
          discountRule[:itemEntitlements][:productVariants][:edges].each do |productVariantDiscount|
            if productVariantDiscount[:node][:id].include? item[:variant_id]
              line_item = {
                variant_id: item[:variant_id],
                quantity: item[:quantity].to_i,
                applied_discount: {
                  description: 'custom',
                  value_type: discountType,
                  value: discountValue,
                  amount: discountType=='percentage' ? item[:original_price].to_f * item[:quantity] * discountValue / 100 : discountValue,
                  title: 'custom'
                }
              }
            end
          end
        end        
      else
        line_item = {
          variant_id: item[:variant_id],
          quantity: item[:quantity].to_i
        }
      end
      
      line_items << line_item

      # Push customized line item
      item[:custom_options].each do |option|
        customItem = {}
        if option[:shopify_variant_id].present?
          if discountValid && !discountTarget
            customItem = {
              variant_id: option[:shopify_variant_id],
              quantity: item[:quantity],
              applied_discount: {
                description: 'custom item',
                title: 'custom item',
                value_type: discountType,
                value: discountValue,
                amount: discountType=='percentage' ? option[:price] * item[:quantity] * discountValue / 100 : 0
              }
            }
          else
            customItem = {
              variant_id: option[:shopify_variant_id],
              quantity: item[:quantity]
            }
          end
        else
          if discountValid && !discountTarget
            customItem = {
              title: option[:label],
              quantity: item[:quantity],
              price: option[:price],
              requires_shipping: true,
              applied_discount: {
                description: 'custom item',
                title: 'custom item',
                value_type: discountType,
                value: discountValue,
                amount: discountType=='percentage' ? option[:price] * item[:quantity] * discountValue / 100 : 0
              }
            }
          else
            if option[:price_type]
              customItem = {
                title: option[:label],
                quantity: item[:quantity],
                price: item[:original_price].to_f * option[:price].to_f / 100,
                requires_shipping: false
              }
            else
              customItem = {
                title: option[:label],
                quantity: item[:quantity],
                price: option[:price],
                requires_shipping: true
              }
            end
          end
        end
        line_items << customItem
      end
    end
    # Add freight shipping into line item list
    totalShippingPrice = freightShipping + fedexShipping
    shippingLine = {
      title: 'Total Shipping',
      custom: true,
      handle: nil,
      price: totalShippingPrice
    }

    if !discountTarget
      draft_order = ShopifyAPI::DraftOrder.new({
        line_items: line_items,
        shipping_line: shippingLine,
        email: 'yong@halfhelix.com'
      })
    elsif discountValid && discountTarget
      draft_order = ShopifyAPI::DraftOrder.new({
        line_items: line_items,
        shipping_line: shippingLine,
        applied_discount: {
          description: 'custom all line',
          title: 'custom',
          value_type: discountRule[:valueV2][:percentage] ? 'percentage' : 'fixed_amount',
          value: discountValue,
          amount: discountType == 'percentage' ? subTotal * discountValue / 100 : discountValue
        },
        email: 'yong@halfhelix.com'
      })
    end
    if draft_order.save
      sleep 1.second
      draft_order_invoice = ShopifyAPI::DraftOrderInvoice.new
      draft_order.send_invoice(draft_order_invoice)
      render json: {draft_order: draft_order}
    else
      puts draft_order.errors.full_messages
      render json: {draft_order: draft_order}
    end
  end

  def uploadFile
    creds = Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])
    # upload file into s3
    s3res = Aws::S3::Resource.new(
      region: 'us-east-2',
      credentials: creds
    )

    fileName = File.basename(params[:quote_file].original_filename, File.extname(params[:quote_file].original_filename))
    obj = s3res.bucket('displays4sale').object('Displays4Sale/request_quote/' + fileName + Time.now.to_i.to_s + File.extname(params[:quote_file].original_filename))
    obj.put(body: params[:quote_file], acl: 'public-read')
    puts "--------------- #{obj.public_url}"
    uploadedFileUrl = obj.public_url

    render json: { file: 'asdf' }

    # render json: {
    #   url: obj.public_url,
    #   name: obj.key
    # }
  end
  
  # create draft order based on the product selected on product page
  def createQuote
    @shop.connect

    # getting data from parameters
    quoteDetail = params[:quoteDetail]
    contactDetail = params[:contactDetail]

    # Initialize line item list
    line_items = []
    line_items << {
      variant_id: params[:variantId],
      quantity: params[:quantity].to_i
    }
    quoteDetail.each do |option|
      customItem = {}
      if option[:price_type]
        customItem = {
          title: option[:label],
          quantity: params[:quantity].to_i,
          price: contactDetail[:originalPrice].to_f * option[:price].to_f / 100,
          requires_shipping: false
        }
      else
        customItem = {
          title: option[:label],
          quantity: params[:quantity].to_i,
          price: option[:price],
          requires_shipping: true
        }
      end
      line_items << customItem
    end

    draft_order = ShopifyAPI::DraftOrder.new({
      line_items: line_items,
      email: params[:contactDetail][:contactEmail]
    })

    if draft_order.save
      sleep 1.second
      draft_order_invoice = ShopifyAPI::DraftOrderInvoice.new
      draft_order.send_invoice(draft_order_invoice)
      render json: {draft_order: draft_order}
    else
      puts draft_order.errors.full_messages
      render json: {draft_order: draft_order}
    end

    # render json: { quote: 'NEWQUOTE' }
  end

  # create draft order based on the data in cart
  def createQuoteWithCart
    puts "here, it creates draftorder with cart data"
  end
  
  def checkDiscount(startsAt, endsAt)
    currentDate = Time.new().to_i
    if startsAt.present?
      discountStartsAt = Time.new(startsAt).to_i
      if endsAt.present?
        discountEndsAt = Time.new(endsAt).to_i
      end
      return (currentDate >= discountStartsAt) && (endsAt.present? ? (currentDate <= discountEndsAt) : true)
    else
      return false
    end
  end

end
