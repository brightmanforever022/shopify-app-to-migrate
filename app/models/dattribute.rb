class Dattribute < ApplicationRecord
  has_many :drellations
  has_many :groups, :through => :drellations
  class << self
    def t
      arel_table
    end

    def filtered_attributes(filter_params)
      order('id ASC')
      .where(
        t[:label].matches("%#{filter_params[:searchText]}%")
      )
    end
  end
end
