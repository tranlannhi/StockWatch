class CreateStocks < ActiveRecord::Migration
  def change
    create_table :stocks do |t|
      t.float :quote
      t.string :symbol
      t.string :sentiment

      t.timestamps
    end
  end
end
