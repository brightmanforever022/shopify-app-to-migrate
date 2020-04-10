class Freightoption < ApplicationRecord
  belongs_to :shop
  
  class << self
    def t
      arel_table
    end
  end
end
