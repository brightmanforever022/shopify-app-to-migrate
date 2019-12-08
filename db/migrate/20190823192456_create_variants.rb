class CreateVariants < ActiveRecord::Migration[5.2]
  def change
    create_table :variants do |t|
      t.integer :shopify_variant_id, null: false, limit: 8
      t.integer :shopify_product_id, null: false, limit: 8
      t.string :thumbnail
      t.string :label
      t.float :price
      t.timestamps
    end
    add_reference :variants, :template, index: true
    add_foreign_key :variants, :templates
  end
end
