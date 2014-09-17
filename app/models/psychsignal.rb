require 'rubygems'
require 'bundler/setup'
require 'httparty'

class Psychsignal
  include HTTParty

  def self.response
    api_key = ENV["PSYCHSIGNAL_API_KEY"]
 	symbol  = "aapl"
    api_url = "https://api.psychsignal.com/v1/sentiments?api_key=#{api_key}&symbol=#{symbol}&from=20140901&to=20140905&period=d&format=JSON"
    
    HTTParty.get(api_url)
  end

end
