class Template < ApplicationRecord
  belongs_to :shop
  has_many :groups, dependent: :destroy
  has_many :variants, dependent: :destroy

  class << self
    def t
      arel_table
    end

    def filtered_templates(filter_params)
      order('created_at DESC')
      .where(
        t[:label].matches("%#{filter_params[:searchText]}%")
      )
    end
  end
end
