class Api::V1::SettingsController < AuthenticatedController
  before_action :set_settings, only: [:index, :update]
  skip_before_action :verify_authenticity_token

  def index
    http_success_response({settings: @settings})
  end

  def create
    
  end

  def show
    
  end

  def edit
  end

  def update
    @settings.update({
      shipping_markup: settings_params[:shipping_markup],
    })

    render json: {settings: @settings }
  end

  private
    def settings_params
      params.except(:id, :controller, :action, :settings)
    end

    def set_settings
      @settings = Settings.first
    end
end
