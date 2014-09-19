require 'rubygems'
require 'bundler/setup'
require 'httparty'

class Psychsignal
  include HTTParty

  def self.getSentiment(symbol,startdate,enddate)
    api_key = ENV["PSYCHSIGNAL_API_KEY"]
 	#startdate = ""
 	#enddate = ""
    api_url = "https://api.psychsignal.com/v1/sentiments?api_key=#{api_key}&symbol=#{symbol}&from=#{startdate}&to=#{enddate}&period=d&format=JSON"
    
    #HTTParty.get(api_url) 
    HTTParty.get(api_url).parsed_response.map {|s| 
	    	{date: s["date"], bullish: s["bullish"], bearish: s["bearish"]}
	    }
  end

end
