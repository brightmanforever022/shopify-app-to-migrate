class Variant < ApplicationRecord

  belongs_to :template
  validates_presence_of :shopify_variant_id
  validates_uniqueness_of :shopify_variant_id

end
