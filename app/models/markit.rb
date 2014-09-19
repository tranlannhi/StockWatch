require 'httparty'

class Markit
  include HTTParty

  def self.getQuote(symbol, startdate, enddate)
    
 	 
 	url = URI.encode("http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp?parameters={Normalized:false,StartDate:\"#{startdate}\",EndDate:\"#{enddate}\",DataPeriod:\"Day\",Elements:[{Symbol:\"#{symbol}\",Type:\"price\",Params:[\"c\"]}]}")
 
    closing_prices = HTTParty.get(url)

    JSON.parse(closing_prices[closing_prices.index(")(")+2..-2])
    # HTTParty.get(closing_prices)
  end

end

