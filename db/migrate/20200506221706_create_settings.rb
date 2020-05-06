class CreateSettings < ActiveRecord::Migration[5.2]
  def change
    create_table :settings do |t|
      t.float :shipping_markup, default: 0
    end
  end
end
