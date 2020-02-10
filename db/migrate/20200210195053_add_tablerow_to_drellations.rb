class AddTablerowToDrellations < ActiveRecord::Migration[5.2]
  def change
    add_column :drellations, :table_row, :string, default: '0'
  end
end
