class Api::V1::AttributesController < AuthenticatedController
  before_action :set_attribute, only: [:show, :edit, :destroy, :update]
  skip_before_action :verify_authenticity_token

  def index
    # puts attribute_index_params.to_json

    currentPage = attribute_index_params[:currentPage].to_i
    perPage = attribute_index_params[:perPage].to_i
    offset = (attribute_index_params[:currentPage].to_i - 1) * perPage

    attributes = Dattribute
      .filtered_attributes(attribute_index_params)
      .offset(offset)
      .limit(perPage)

    totals = Dattribute
      .filtered_attributes(attribute_index_params)
      .count

    totalPages = (totals.to_f / perPage.to_f).ceil
    hasNext = totalPages > currentPage
    hasPrevious = currentPage > 1

    http_success_response({attributes: attributes, hasNext: hasNext, hasPrevious: hasPrevious, totalPages: totalPages, currentPage: currentPage})
  end

  def create
    @attribute = Dattribute.new(
      label: attribute_params[:label],
      price: attribute_params[:price],
      price_type: false,
      weight: attribute_params[:weight],
      width: attribute_params[:width],
      length: attribute_params[:length],
      girth: attribute_params[:girth],
      weight2: attribute_params[:weight2],
      width2: attribute_params[:width2],
      length2: attribute_params[:length2],
      girth2: attribute_params[:girth2],
      weight3: attribute_params[:weight3],
      width3: attribute_params[:width3],
      length3: attribute_params[:length3],
      girth3: attribute_params[:girth3],
      weight4: attribute_params[:weight4],
      width4: attribute_params[:width4],
      length4: attribute_params[:length4],
      girth4: attribute_params[:girth4],
      weight5: attribute_params[:weight5],
      width5: attribute_params[:width5],
      length5: attribute_params[:length5],
      girth5: attribute_params[:girth5],
      weight6: attribute_params[:weight6],
      width6: attribute_params[:width6],
      length6: attribute_params[:length6],
      girth6: attribute_params[:girth6],
      attribute_code: attribute_params[:attribute_code],
      postal_code: attribute_params[:postal_code],
      freight: attribute_params[:freight],
      store_list: attribute_params[:store_list],
      vendor_sku: attribute_params[:vendor_sku],
      min_ship_quantity: attribute_params[:min_ship_quantity],
      max_ship_quantity: attribute_params[:max_ship_quantity],
      ship_price_percent: attribute_params[:ship_price_percent]
    )
    if @attribute.save
      http_success_response({attribute: @attribute})
    else
      http_error_response({error: @attribute.errors.full_messages}, 400)
    end
  end

  def show
    storeList = Shop.order('id ASC')
    render json: {attribute: @attribute, storeList: storeList}
  end

  def edit
  end

  def update
    @attribute.update({
      label: attribute_params[:label],
      price: attribute_params[:price],
      price_type: attribute_params[:price_type],
      weight: attribute_params[:weight],
      width: attribute_params[:width],
      length: attribute_params[:length],
      girth: attribute_params[:girth],
      weight2: attribute_params[:weight2],
      width2: attribute_params[:width2],
      length2: attribute_params[:length2],
      girth2: attribute_params[:girth2],
      weight3: attribute_params[:weight3],
      width3: attribute_params[:width3],
      length3: attribute_params[:length3],
      girth3: attribute_params[:girth3],
      weight4: attribute_params[:weight4],
      width4: attribute_params[:width4],
      length4: attribute_params[:length4],
      girth4: attribute_params[:girth4],
      weight5: attribute_params[:weight5],
      width5: attribute_params[:width5],
      length5: attribute_params[:length5],
      girth5: attribute_params[:girth5],
      weight6: attribute_params[:weight6],
      width6: attribute_params[:width6],
      length6: attribute_params[:length6],
      girth6: attribute_params[:girth6],
      attribute_code: attribute_params[:attribute_code],
      postal_code: attribute_params[:postal_code],
      freight: attribute_params[:freight],
      store_list: attribute_params[:store_list],
      vendor_sku: attribute_params[:vendor_sku],
      min_ship_quantity: attribute_params[:min_ship_quantity],
      max_ship_quantity: attribute_params[:max_ship_quantity],
      ship_price_percent: attribute_params[:ship_price_percent]
    })

    render json: {attribute: @attribute }
  end

  def destroy
    if @attribute.destroy
      http_success_response({})
    else
      http_error_response({message: @attribute.errors.full_messages}, 400)
    end
  end

  def search_options
    attributes = Dattribute
      .filtered_attributes(attribute_index_params)
      .limit(10)

    http_success_response({attributes: attributes})
  end

  def list_stores
    storeList = Shop.order('id ASC')
    http_success_response({storeList: storeList})
  end

  private
    def attribute_params
      params.except(:id, :controller, :action, :attribute)
    end

    def set_attribute
      @attribute = Dattribute.find(params[:id])
    end

    def attribute_index_params
      params.permit(:currentPage, :searchText, :perPage)
    end

end
