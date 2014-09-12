class CreatePortfolios < ActiveRecord::Migration
  def change
    create_table :portfolios do |t|
      t.string :stocks

      t.timestamps
    end
  end
end
