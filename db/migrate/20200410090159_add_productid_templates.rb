class AddProductidTemplates < ActiveRecord::Migration[5.2]
  def change
    add_column :templates, :product_id, :string
  end
end
