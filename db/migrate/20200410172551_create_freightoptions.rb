class CreateFreightoptions < ActiveRecord::Migration[5.2]
  def change
    create_table :freightoptions do |t|
      t.string :label
      t.float :price
      t.timestamps
      t.timestamps
    end

    add_reference :freightoptions, :shop, index: true
    add_foreign_key :freightoptions, :shops
  end
end
