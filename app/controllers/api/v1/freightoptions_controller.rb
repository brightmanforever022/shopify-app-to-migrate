class Api::V1::FreightoptionsController < AuthenticatedController
  before_action :set_freightoption, only: [:show, :edit, :destroy, :update]
  skip_before_action :verify_authenticity_token
  
  def index
    currentPage = freightoption_index_params[:currentPage].to_i
    perPage = freightoption_index_params[:perPage].to_i
    offset = (freightoption_index_params[:currentPage].to_i - 1) * perPage

    freightoptions = @shop.freightoptions
      .offset(offset)
      .limit(perPage)

    totals = @shop.freightoptions
      .count

    totalPages = (totals.to_f / perPage.to_f).ceil
    hasNext = totalPages > currentPage
    hasPrevious = currentPage > 1

    http_success_response({freightoptions: freightoptions, hasNext: hasNext, hasPrevious: hasPrevious})
  end

  def create
    @freightoption = Freightoption.new(
      label: freightoption_params[:label],
      price: freightoption_params[:price],
      description: freightoption_params[:description],
      shop: @shop
    )
    if @freightoption.save
      http_success_response({freightoption: @freightoption})
    else
      http_error_response({error: @freightoption.errors.full_messages}, 400)
    end
  end

  def show
    render json: {
      freightoption: @freightoption
    }
  end

  def edit
  end

  def update
    @freightoption.update({
      label: freightoption_params[:label],
      price: freightoption_params[:price],
      description: freightoption_params[:description],
    })

    render json: {
      freightoption: @freightoption
    }
  end

  def destroy
    if @freightoption.destroy
      http_success_response({})
    else
      http_error_response({message: @freightoption.errors.full_messages}, 400)
    end
  end

  private
    def freightoption_params
      params.except(:id, :controller, :action, :freightoption)
    end

    def set_freightoption
      @freightoption = @shop.freightoptions.find(params[:id])
    end

    def freightoption_index_params
      params.permit(:currentPage, :searchText, :perPage)
    end

end
