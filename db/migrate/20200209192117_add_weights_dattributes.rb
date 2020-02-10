class AddWeightsDattributes < ActiveRecord::Migration[5.2]
  def change
    add_column :dattributes, :weight2, :float, default: 0
    add_column :dattributes, :weight3, :float, default: 0
  end
end
