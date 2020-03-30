class Quote < ApplicationRecord
  belongs_to :shop
  
  class << self
    def t
      arel_table
    end

    def filtered_quotes(filter_params)
      order('created_at DESC')
      .where(
        t[:dorder_name].matches("%#{filter_params[:searchText]}%")
      )
    end
  end
end
