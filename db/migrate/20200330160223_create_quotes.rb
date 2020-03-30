class CreateQuotes < ActiveRecord::Migration[5.2]
  def change
    create_table :quotes do |t|
      t.string :dorder_id
      t.string :dorder_name
      t.string :dorder_invoice_url
      t.string :uploaded_file_url
      t.string :uploaded_file_name
      t.timestamps
      t.timestamps
    end

    add_reference :quotes, :shop, index: true
    add_foreign_key :quotes, :shops
  end
end
