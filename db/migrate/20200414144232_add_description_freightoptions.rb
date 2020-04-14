class AddDescriptionFreightoptions < ActiveRecord::Migration[5.2]
  def change
    add_column :freightoptions, :description, :string
  end
end
