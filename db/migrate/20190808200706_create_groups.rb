class CreateGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :groups do |t|
      t.string :label
      t.integer :group_type
      t.boolean :is_required, default: true
      t.integer :display_order, null: false
      t.timestamps
    end
    add_reference :groups, :template, index: true
    add_foreign_key :groups, :templates
  end
end
