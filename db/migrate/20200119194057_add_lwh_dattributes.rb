class AddLwhDattributes < ActiveRecord::Migration[5.2]
  def change
    add_column :dattributes, :width2, :float, default: 0
    add_column :dattributes, :length2, :float, default: 0
    add_column :dattributes, :girth2, :float, default: 0
    add_column :dattributes, :width3, :float, default: 0
    add_column :dattributes, :length3, :float, default: 0
    add_column :dattributes, :girth3, :float, default: 0
  end
end
