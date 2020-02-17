class AddNewFieldsDattributes < ActiveRecord::Migration[5.2]
  def change
    add_column :dattributes, :min_ship_quantity, :integer, default: 0
    add_column :dattributes, :max_ship_quantity, :integer, default: 0
    add_column :dattributes, :ship_price_percent, :float, default: 0
  end
end
