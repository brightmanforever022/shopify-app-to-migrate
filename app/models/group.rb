class Group < ApplicationRecord
  default_scope { order(display_order: :asc) }
  
  belongs_to :template
  has_many :items, dependent: :destroy
  has_many :drellations, dependent: :destroy
  has_many :dattributes, :through => :drellations
end
