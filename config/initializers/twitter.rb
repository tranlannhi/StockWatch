require 'twitter'

twitter = Twitter::REST::Client.new do |config|
  config.consumer_key = ENV['12345']
  config.consumer_secret = ENV['CONSUMER_SECRET']
  config.access_token = ENV['YOUR_ACCESS_TOKEN']
  config.access_token_secret = ENV['YOUR_ACCESS_SECRET']
end