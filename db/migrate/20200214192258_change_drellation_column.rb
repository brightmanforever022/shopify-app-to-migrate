class ChangeDrellationColumn < ActiveRecord::Migration[5.2]
  def change
    rename_column :drellations, :table_row, :table_row_option
    add_column :drellations, :table_row_vendor, :string, default: '0'
  end
end
