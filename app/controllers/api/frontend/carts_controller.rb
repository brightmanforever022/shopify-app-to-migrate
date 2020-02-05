class Api::Frontend::CartsController < Api::Frontend::BaseController

  def index
    
  end

  def create
        
  end

  def update
    
  end

  def fedex_options_list
    puts "fedex parameters: #{cart_params[:cart]}"
    http_success_response(cart_params[:cart])
  end

  private
    def cart_params
      params.except(:controller, :action, :id)
    end

end
