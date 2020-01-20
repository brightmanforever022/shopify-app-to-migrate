class ChangeDattributeColumn < ActiveRecord::Migration[5.2]
  def change
    rename_column :dattributes, :store_name, :store_list
  end
end
