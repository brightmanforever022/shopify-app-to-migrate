class AddExceptsToDrellations < ActiveRecord::Migration[5.2]
  def change
    add_column :drellations, :excepts, :string, default: ''
  end
end
