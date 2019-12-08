class CreateItems < ActiveRecord::Migration[5.2]
  def change
    create_table :items do |t|
      t.string :label
      t.integer :shopify_variant_id, limit: 8
      t.float :price
      t.integer :quantity
      t.integer :display_order
      t.timestamps
    end

    add_reference :items, :group, index: true
    add_foreign_key :items, :groups
  end
end
