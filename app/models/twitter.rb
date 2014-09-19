
# require 'httparty'

# class Twitter
#   include HTTParty
#   include twitter

#   def self.TwitterData(symbol)
    
#     api_url = "https://stream.twitter.com/1.1/statuses/filter.json?track=$#{symbol}"
    
#     @tweets = client.search("$"+symbol).take(20)
#     HTTParty.get(api_url)
	    
#   end

# end
