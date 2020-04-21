class Api::V1::VendorsController < AuthenticatedController
  before_action :set_vendor, only: [:show, :destroy, :update]
  skip_before_action :verify_authenticity_token
  
  def index
    currentPage = vendor_index_params[:currentPage].to_i
    perPage = vendor_index_params[:perPage].to_i
    offset = (vendor_index_params[:currentPage].to_i - 1) * perPage

    vendors = Vendor
      .filtered_vendors(vendor_index_params)
      .offset(offset)
      .limit(perPage)

    totals = Vendor
      .filtered_vendors(vendor_index_params)
      .count

    totalPages = (totals.to_f / perPage.to_f).ceil
    hasNext = totalPages > currentPage
    hasPrevious = currentPage > 1

    http_success_response({vendors: vendors, hasNext: hasNext, hasPrevious: hasPrevious})
  end

  def create
    @vendor = Vendor.new(
      vendor_name: vendor_params[:vendor_name],
      zip_code: vendor_params[:zip_code],
    )
    if @vendor.save
      http_success_response({vendor: @vendor})
    else
      http_error_response({error: @vendor.errors.full_messages}, 400)
    end
  end

  def show
    render json: {
      vendor: @vendor
    }
  end

  def edit
  end

  def update
    @vendor.update({
      vendor_name: vendor_params[:vendor_name],
      zip_code: vendor_params[:zip_code],
    })

    render json: {
      vendor: @vendor
    }
  end

  def destroy
    if @vendor.destroy
      http_success_response({})
    else
      http_error_response({message: @vendor.errors.full_messages}, 400)
    end
  end

  private
    def vendor_params
      params.except(:id, :controller, :action, :vendor)
    end

    def set_vendor
      @vendor = Vendor.find(params[:id])
    end

    def vendor_index_params
      params.permit(:currentPage, :searchText, :perPage)
    end

end
