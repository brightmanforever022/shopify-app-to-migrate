class ApplicationController < ActionController::Base

  def http_success_response hash
    render json: hash, status: :ok
  end

  def http_error_response error_hash, status_code
    render json: error_hash, status: status_code
  end

end
