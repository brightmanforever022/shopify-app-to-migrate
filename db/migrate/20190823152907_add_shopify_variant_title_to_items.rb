class AddShopifyVariantTitleToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :shopify_variant_title, :string
  end
end
