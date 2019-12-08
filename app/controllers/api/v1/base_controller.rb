class Api::V1::BaseController < AuthenticatedController

  def http_success_response (hash, includes = nil)
    render json: hash, include: includes, status: :ok
  end

  def http_error_response error_hash, status_code
    render json: error_hash, status: status_code
  end

end
