class AddBoxesToDattributes < ActiveRecord::Migration[5.2]
  def change
    add_column :dattributes, :width4, :float, default: 0
    add_column :dattributes, :length4, :float, default: 0
    add_column :dattributes, :girth4, :float, default: 0
    add_column :dattributes, :weight4, :float, default: 0
    add_column :dattributes, :width5, :float, default: 0
    add_column :dattributes, :length5, :float, default: 0
    add_column :dattributes, :girth5, :float, default: 0
    add_column :dattributes, :weight5, :float, default: 0
    add_column :dattributes, :width6, :float, default: 0
    add_column :dattributes, :length6, :float, default: 0
    add_column :dattributes, :girth6, :float, default: 0
    add_column :dattributes, :weight6, :float, default: 0    
  end
end
