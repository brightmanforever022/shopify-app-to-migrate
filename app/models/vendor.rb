class Vendor < ApplicationRecord
  class << self
    def t
      arel_table
    end

    def filtered_vendors(filter_params)
      order('id ASC')
      .where(
        t[:vendor_name].matches("%#{filter_params[:searchText]}%")
      )
    end
  end
end
