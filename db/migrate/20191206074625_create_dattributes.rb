class CreateDattributes < ActiveRecord::Migration[5.2]
  def change
    create_table :dattributes do |t|
      t.string :label, null: false
      t.float :price
      t.boolean :price_type
      t.float :weight
      t.float :width
      t.float :length
      t.float :girth
      t.string :attribute_code
    end
  end
end
