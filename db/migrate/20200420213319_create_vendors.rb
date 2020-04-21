class CreateVendors < ActiveRecord::Migration[5.2]
  def change
    create_table :vendors do |t|
      t.string :vendor_name
      t.string :zip_code
    end
  end
end
