class CreateTemplates < ActiveRecord::Migration[5.2]
  def change
    create_table :templates do |t|
      t.string :label, null: false
      t.string :thumbnail
      t.string :product_type
      t.integer :shopify_product_id, limit: 8
      t.timestamps
      t.timestamps
    end

    add_reference :templates, :shop, index: true
    add_foreign_key :templates, :shops
  end
end
