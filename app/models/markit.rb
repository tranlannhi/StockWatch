require 'httparty'

class Markit
  include HTTParty

  def self.getQuote(searchTerm)
    
 	symbol  = "aapl"
 	url = URI.encode("http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp?parameters={Normalized:false,StartDate:\"2014-09-01T00:00:00-00\",EndDate:\"2014-09-17T00:00:00-00\",DataPeriod:\"Day\",Elements:[{Symbol:\"AAPL\",Type:\"price\",Params:[\"c\"]}]}")
 
    closing_prices = HTTParty.get(url)

    JSON.parse(closing_prices[closing_prices.index(")(")+2..-2])
    # HTTParty.get(closing_prices)
  end

end
