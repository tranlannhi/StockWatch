
require 'httparty'
require 'twitter'

class Twitterfeed
  include Twitter

  def self.getFeed(symbol)
    

    client = Twitter::REST::Client.new do |config|
		  config.consumer_key = ENV['TWITTER_CONSUMER_KEY']
		  config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
		  config.oauth_token = ENV['TWITTER_OAUTH_TOKEN']
		  config.oauth_token_secret = ENV['TWITTER_OAUTH_SECRET']
		end
		
		@tweets = client.search("$"+symbol).take(5)	
	    
  end

end
