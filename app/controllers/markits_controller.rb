class MarkitsController < ApplicationController

  def index
     @quote = Markit.getQuote("aapl")["Dates"]
  end
end