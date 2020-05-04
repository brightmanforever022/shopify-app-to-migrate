class Api::Frontend::OrdersController < Api::Frontend::BaseController
  require 'aws-sdk'

  def create
    @shop.connect
    # getting data from parameters
    items = params[:lineItems]
    discountRule = params[:discountRule]
    freightShipping = params[:orderFreightShipping].to_f
    fedexShipping = params[:orderFedexShipping].to_f
    
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
      customDescription = []
      customPrice = 0.0
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
                  amount: discountType=='percentage' ? item[:original_price].to_f * item[:quantity].to_i * discountValue / 100 : discountValue,
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
                  amount: discountType=='percentage' ? item[:original_price].to_f * item[:quantity].to_i * discountValue / 100 : discountValue,
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
        # customItem = {}
        # if option[:price_type]
        #   customItem = {
        #     title: option[:label],
        #     quantity: item[:quantity],
        #     price: item[:original_price].to_f * option[:price].to_f / 100,
        #     requires_shipping: false
        #   }
        #   customPrice += 
        # else
        #   customItem = {
        #     title: option[:label],
        #     quantity: item[:quantity],
        #     price: option[:price],
        #     requires_shipping: true
        #   }
        # end
        customPrice += option[:price_type] ? item[:original_price].to_f * option[:price].to_f / 100 : option[:price]
        customDescription.push({
          name: ' - ' + option[:group],
          value: option[:label] + '<br/>'
        })
      end
      discountPercent = getDiscountByQuantity(item[:shipping_summary], item[:quantity])
      discountedCustomPrice = customPrice * (100 - discountPercent) / 100
      discountAmount = customPrice * item[:quantity].to_i * discountPercent / 100
      # line_items.push({
      #   title: 'Selections',
      #   quantity: item[:quantity].to_i,
      #   price: discountedCustomPrice,
      #   properties: customDescription
      # })
      line_items.push({
        title: 'Selections',
        quantity: item[:quantity].to_i,
        price: customPrice,
        properties: customDescription,
        applied_discount: {
          title: 'Discount by quantity',
          value: discountPercent,
          value_type: 'percentage',
          amount: discountAmount
        }
      })
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

    billingAddress = {
      address1: contactDetail[:billingAddress1],
      address2: contactDetail[:billingAddress2],
      city: contactDetail[:billingTownCity],
      country: contactDetail[:billingCountry],
      province: contactDetail[:billingState],
      zip: contactDetail[:billingPostalCode],
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
      billing_address: billingAddress,
      metafields: [
        {
          namespace: 'contact',
          key: 'isOutUS',
          value_type: 'integer',
          value: contactDetail[:isOutUS] ? 1 : 0,
        },
        {
          namespace: 'contact',
          key: 'outAddress',
          value_type: 'string',
          value: (contactDetail[:outAddress] == '') ? 'empty' : contactDetail[:outAddress],
        },
        {
          namespace: 'contact',
          key: 'isResidential',
          value_type: 'integer',
          value: contactDetail[:isResidential] ? 1 : 0,
        },
        {
          namespace: 'contact',
          key: 'shippingMethod',
          value_type: 'string',
          value: (contactDetail[:shippingMethod] == '') ? 'empty' : contactDetail[:shippingMethod],
        },
        {
          namespace: 'contact',
          key: 'isLiftGate',
          value_type: 'integer',
          value: contactDetail[:isLiftGate] ? 1 : 0,
        },
        {
          namespace: 'contact',
          key: 'isFreight',
          value_type: 'integer',
          value: contactDetail[:isFreight] ? 1 : 0,
        },
        {
          namespace: 'contact',
          key: 'quoteElseKnow',
          value_type: 'string',
          value: (contactDetail[:quoteElseKnow] == '') ? 'empty' : contactDetail[:quoteElseKnow],
        },
      ],
    })
    
    if draft_order.save
      sleep 1.second
      # draft_order_invoice = ShopifyAPI::DraftOrderInvoice.new
      # draft_order.send_invoice(draft_order_invoice)
      # store draftorder id and file url. file url is in contactDetail[:uploadedFile].url
      if contactDetail[:uploadedFile].present?
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
        render json: {quote: draft_order}
      end
    else
      puts draft_order.errors.full_messages
      render json: {draft_order: draft_order}
    end
    # render json: {draft_order: 'draft_order'}
  end

  # create draft order based on the data in cart
  def createQuoteWithCart
    cartItemList = params[:lines]
    contactDetail = params[:contactDetail]

    # Make LineItems
    line_items = []
    cartItemList.each do |cartItem|
      line_items << {
        variant_id: cartItem[:variant_id],
        quantity: cartItem[:quantity].to_i,
      }
      customPrice = 0.0
      customDescription = []
      cartItem[:custom_options].each do |cartOption|
        customPrice += cartOption[:price_type] ? cartOption[:original_price].to_f * cartOption[:price].to_f / 100 : cartOption[:price]
        customDescription.push({
          name: ' - ' + cartOption[:group],
          value: cartOption[:label]
        })
      end
      discountPercent = getDiscountByQuantity(cartItem[:shipping_summary], cartItem[:quantity])
      discountedCustomPrice = customPrice * (100 - discountPercent) / 100
      discountAmount = customPrice * cartItem[:quantity].to_i * discountPercent / 100

      line_items.push({
        title: 'Selections',
        quantity: cartItem[:quantity].to_i,
        price: customPrice,
        properties: customDescription,
        applied_discount: {
          title: 'Discount by quantity',
          value: discountPercent,
          value_type: 'percentage',
          amount: discountAmount
        }
      })
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

    billingAddress = {
      address1: contactDetail[:billingAddress1],
      address2: contactDetail[:billingAddress2],
      city: contactDetail[:billingTownCity],
      country: contactDetail[:billingCountry],
      province: contactDetail[:billingState],
      zip: contactDetail[:billingPostalCode],
    }
    
    draft_order = ShopifyAPI::DraftOrder.new({
      line_items: line_items,
      email: contactDetail[:contactEmail],
      customer: customerData,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      metafields: [
        {
          namespace: 'contact',
          key: 'isOutUS',
          value_type: 'integer',
          value: contactDetail[:isOutUS] ? 1 : 0,
        },
        {
          namespace: 'contact',
          key: 'outAddress',
          value_type: 'string',
          value: (contactDetail[:outAddress] == '') ? 'empty' : contactDetail[:outAddress],
        },
        {
          namespace: 'contact',
          key: 'isResidential',
          value_type: 'integer',
          value: contactDetail[:isResidential] ? 1 : 0,
        },
        {
          namespace: 'contact',
          key: 'shippingFedexMethod',
          value_type: 'string',
          value: contactDetail[:shippingFedexMethod],
        },
        {
          namespace: 'contact',
          key: 'shippingFreightMethod',
          value_type: 'string',
          value: contactDetail[:shippingFreightMethod],
        },
        {
          namespace: 'contact',
          key: 'isLiftGate',
          value_type: 'integer',
          value: contactDetail[:isLiftGate] ? 1 : 0,
        },
        {
          namespace: 'contact',
          key: 'isFreight',
          value_type: 'integer',
          value: contactDetail[:isFreight] ? 1 : 0,
        },
        {
          namespace: 'contact',
          key: 'quoteElseKnow',
          value_type: 'string',
          value: (contactDetail[:quoteElseKnow] == '') ? 'empty' : contactDetail[:quoteElseKnow],
        },
      ],
    })
    
    if draft_order.save
      sleep 1.second
      # draft_order_invoice = ShopifyAPI::DraftOrderInvoice.new
      # draft_order.send_invoice(draft_order_invoice)
      # store draftorder id and file url. file url is in contactDetail[:uploadedFile].url
      if contactDetail[:uploadedFile].present?
        @quote = Quote.new(
          dorder_id: draft_order.id,
          dorder_name: draft_order.name,
          dorder_invoice_url: draft_order.invoice_url,
          uploaded_file_url: contactDetail[:uploadedFile][:url],
          uploaded_file_name: contactDetail[:uploadedFile][:name],
          shop: @shop
        )
        if @quote.save
          render json: { quote: @quote, error: nil }
        else
          render json: { quote: @quote, error: @quote.errors.full_messages }
        end
      else
        render json: { quote: draft_order, error: nil }
      end
    else
      puts draft_order.errors.full_messages
      render json: { draft_order: draft_order, error: 'Could not create quote. Please check your data.' }
    end
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

  private
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

      return discountPercent
    end

end
