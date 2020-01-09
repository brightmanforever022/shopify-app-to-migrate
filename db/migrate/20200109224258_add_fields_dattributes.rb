class AddFieldsDattributes < ActiveRecord::Migration[5.2]
  def change
    add_column :dattributes, :postal_code, :string, default: ''
    add_column :dattributes, :store_name, :string, default: 'display4sale'
    add_column :dattributes, :vendor_sku, :string, default: ''
  end
end
