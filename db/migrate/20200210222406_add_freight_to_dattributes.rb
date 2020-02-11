class AddFreightToDattributes < ActiveRecord::Migration[5.2]
  def change
    add_column :dattributes, :freight, :boolean, default: false
  end
end
