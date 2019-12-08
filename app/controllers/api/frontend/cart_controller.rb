class Api::Frontend::CartController < Api::Frontend::BaseController

  def index
    session[:line_items] = []
  end

  def create
    # if session[:line_items].blank?
    #   session[:line_items] = []
    # end
    session[:line_items] ||= []
    line_item = {
      variant_id: params[:variant_id],
      quantity: params[:quantity],
      line_id: params[:lineId],
      properties: []
    }
    params[:options].each do |option|
      if option[:shopify_variant_id].present?
        item = {
          variant_id: option[:shopify_variant_id],
          quantity: params[:quantity] * option[:quantity]
        }
      else
        item = {
          title: option[:label],
          quantity: params[:quantity] * option[:quantity],
          price: option[:price],
          requires_shipping: true
        }
      end
      line_item[:properties].push(item)
    end
    # render json: {lineItems: session[:line_items]}
    render json: {lineItems: session[:session_id]}
    session[:line_items].push(line_item)
    
  end

  def update
    updateMethod = params[:updateMethod]
    lineId = params[:id]

    case updateMethod
    when 'remove'
      session[:line_items].map{ |line_item| line_item.lineId == lineId ? nil : line_item }.reject(&:nil?)
    when 'plus'
      lineItems = session[:line_items]
      plusedLineIndex = lineItems.index(lineItems.find{ |lineItem| lineItem.lineId == lineId })
      lineItems[:plusedLineIndex][:quantity] = lineItems[:plusedLineIndex][:quantity].to_i + 1
      session[:line_items][:plusedLineIndex] = lineItems[:plusedLineIndex]
    when 'minus'
      lineItems = session[:line_items]
      plusedLineIndex = lineItems.index(lineItems.find{ |lineItem| lineItem.lineId == lineId })
      if lineItems[:plusedLineIndex][:quantity].to_i > 1
        lineItems[:plusedLineIndex][:quantity] = lineItems[:plusedLineIndex][:quantity].to_i + 1
        session[:line_items][:plusedLineIndex] = lineItems[:plusedLineIndex]
      else
        lineItems.map{ |lineItem| lineItem.lineId == lineId ? nil : lineItem }.reject(&:nil?)
        session[:line_items] = lineItems
      end
    end
  end

end
