class Drellation < ApplicationRecord
  default_scope { order(id: :asc) }

  belongs_to :group
  belongs_to :dattribute
  
  class << self
    def t
      arel_table
		end
  end
end
