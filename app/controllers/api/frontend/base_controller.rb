class Api::Frontend::BaseController < ApplicationController

  skip_before_action :verify_authenticity_token
  before_action :verify_secure_request

  def success_response (hash, includes = nil)
    render json: hash, include: includes, status: :ok
  end

  def error_response message
    render json: {error: message}, status: 400
  end

  private
    def verify_secure_request
      render json: { error_msg: t('invalid_token') }, status: :forbidden unless valid_request_token?
    end

    def valid_request_token?
      token = request.headers['d4s-token']
      @shop = Shop.where(api_key: token).take if token.present?
      token.present? && @shop.present?
    end

end
