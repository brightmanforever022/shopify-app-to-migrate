class Api::Frontend::OrdersController < Api::Frontend::BaseController

  def create
    @shop.connect
    # getting data from parameters
    items = params[:lineItems]
    discountRule = params[:discountRule]
    freightShipping = params[:orderFreightShipping]
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
              quantity: item[:quantity] * option[:quantity],
              applied_discount: {
                description: 'custom item',
                title: 'custom item',
                value_type: discountType,
                value: discountValue,
                amount: discountType=='percentage' ? option[:price] * item[:quantity] * option[:quantity] * discountValue / 100 : 0
              }
            }
          else
            customItem = {
              variant_id: option[:shopify_variant_id],
              quantity: item[:quantity] * option[:quantity]
            }
          end
        else
          if discountValid && !discountTarget
            customItem = {
              title: option[:label],
              quantity: item[:quantity] * option[:quantity],
              price: option[:price],
              requires_shipping: true,
              applied_discount: {
                description: 'custom item',
                title: 'custom item',
                value_type: discountType,
                value: discountValue,
                amount: discountType=='percentage' ? option[:price] * item[:quantity] * option[:quantity] * discountValue / 100 : 0
              }
            }
          else
            customItem = {
              title: option[:label],
              quantity: item[:quantity] * option[:quantity],
              price: option[:price],
              requires_shipping: true
            }
          end
        end
        line_items << customItem
      end
    end
    # Add freight shipping into line item list
    shippingItem = {
      title: 'Lift-Gate Service',
      quantity: 1,
      price: freightShipping
    }

    if freightShipping.to_i > 0
      line_items << shippingItem
    end
    
    if !discountTarget
      draft_order = ShopifyAPI::DraftOrder.new({
        line_items: line_items,
        email: 'yong@halfhelix.com'
      })
    elsif discountValid && discountTarget
      draft_order = ShopifyAPI::DraftOrder.new({
        line_items: line_items,
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

  def checkDiscount(startsAt, endsAt)
    currentDate = Time.new().to_i
    if startsAt.present?
      discountStartsAt = Time.new(startsAt).to_i
      if endsAt.present?
        discountEndsAt = Time.new(endsAt).to_i
      end
      return (currentDate >= discountStartsAt) && (endsAt ? (currentDate <= discountEndsAt) : true)
    else
      return false
    end
  end


end
