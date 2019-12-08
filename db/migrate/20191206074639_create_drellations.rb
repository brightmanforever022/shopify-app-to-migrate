class CreateDrellations < ActiveRecord::Migration[5.2]
  def change
    create_table :drellations do |t|
      t.belongs_to :group
      t.belongs_to :dattribute
    end
  end
end
