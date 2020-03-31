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
    uploadedFileUrl = obj.public_url

    render json: {
      url: obj.public_url,
      name: fileName
    }
  end
  
  # create draft order based on the product selected on product page
  def createQuote
    @shop.connect

    # getting data from parameters
    quoteDetail = params[:quoteDetail]
    contactDetail = params[:contactDetail]
    productQuantity = params[:quantity].to_i
    
    # Initialize line item list
    line_items = []
    line_items << {
      variant_id: params[:variantId],
      quantity: productQuantity,
      
    }
    subTotalPrice = 0.0
    quoteDetail.each do |option|
      customItem = {}
      if option[:price_type]
        customItem = {
          title: option[:label],
          quantity: productQuantity,
          price: contactDetail[:originalPrice].to_f * option[:price].to_f / 100,
          requires_shipping: false
        }
        subTotalPrice += contactDetail[:originalPrice].to_f * option[:price].to_f / 100 * productQuantity
      else
        customItem = {
          title: option[:label],
          quantity: productQuantity,
          price: option[:price].to_f,
          requires_shipping: true
        }
        subTotalPrice += option[:price].to_f * productQuantity
      end
      line_items << customItem
    end
    
    customerName = contactDetail[:contactName].split(' ')
    customerData = {
      email: contactDetail[:contactEmail],
      first_name: customerName[0],
      last_name: customerName[1] ? customerName[1] : '',
    }
    if contactDetail[:contactPhone] != ''
      customerData[:phone] = contactDetail[:contactPhone]
    end

    shippingAddress = {
      address1: contactDetail[:address1],
      address2: contactDetail[:address2],
      city: contactDetail[:townCity],
      company: contactDetail[:contactCompany],
      country: contactDetail[:contactCountry],
      province: contactDetail[:contactState],
      first_name: customerName[0],
      last_name: customerName[1] ? customerName[1] : '',
      name: contactDetail[:contactName],
      phone: contactDetail[:contactPhone],
      zip: contactDetail[:postalCode],
    }

    # get discount rules from product
    metaShipping = contactDetail[:metaShipping][:value]
    mapShippingLines = metaShipping.split("\n")
    shippingDiscountList = []
    
    mapShippingLines.each do |shippingLine|
      shippingLineItems = shippingLine.split(',')
      shippingQtyItems = shippingLineItems[0].split(' ')
      shippingQty = shippingQtyItems[1].split('-')
      qtyFrom = shippingQty[0].to_i
      qtyTo = shippingQty[1].to_i
      shippingLineItems[1]["%"] = ""
      discountPercent = shippingLineItems[1].to_i

      shippingDiscountList.push({
        qtyFrom: qtyFrom,
        qtyTo: qtyTo,
        discountPercent: discountPercent
      })
    end

    # get proper discount amount by product quantity
    discountAmount = 0
    shippingDiscountList.each do |discountItem|
      if productQuantity >= discountItem[:qtyFrom] and productQuantity <= discountItem[:qtyTo]
        discountAmount = discountItem[:discountPercent]
      end
    end
    
    draft_order = ShopifyAPI::DraftOrder.new({
      line_items: line_items,
      applied_discount: {
        title: "Quantity Discount",
        description: "This is the discount by quantity rules.",
        value: discountAmount,
        value_type: 'percentage',
        amount: subTotalPrice * discountAmount / 100
      },
      email: contactDetail[:contactEmail],
      customer: customerData,
      shipping_address: shippingAddress,
    })
    
    if draft_order.save
      sleep 1.second
      draft_order_invoice = ShopifyAPI::DraftOrderInvoice.new
      draft_order.send_invoice(draft_order_invoice)
      # store draftorder id and file url. file url is in contactDetail[:uploadedFile].url
      @quote = Quote.new(
        dorder_id: draft_order.id,
        dorder_name: draft_order.name,
        dorder_invoice_url: draft_order.invoice_url,
        uploaded_file_url: contactDetail[:uploadedFile][:url],
        uploaded_file_name: contactDetail[:uploadedFile][:name],
        shop: @shop
      )
      if @quote.save
        render json: {quote: @quote}
      else
        render json: {error: @quote.errors.full_messages}
      end
    else
      puts draft_order.errors.full_messages
      render json: {draft_order: draft_order}
    end
    # render json: {draft_order: 'draft_order'}
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
