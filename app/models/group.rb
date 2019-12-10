class Group < ApplicationRecord
  belongs_to :template
  has_many :items, dependent: :destroy
  has_many :drellations, dependent: :destroy
  has_many :dattributes, :through => :drellations
end
