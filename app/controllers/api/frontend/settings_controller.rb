class Api::Frontend::SettingsController < Api::Frontend::BaseController

  def index
    settings = Settings.first
    render json: {
      settings: settings
    }
  end

  
end
