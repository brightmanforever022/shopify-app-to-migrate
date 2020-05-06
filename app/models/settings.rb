class Settings < ApplicationRecord
  class << self
    def t
      arel_table
    end
  end
end
