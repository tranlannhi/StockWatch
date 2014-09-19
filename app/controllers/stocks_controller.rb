
require 'httparty'
require 'twitter'

class StocksController < ApplicationController
	before_action :all_stocks, only: [:index]
	respond_to :html, :json

	def show
		# @response = Psychsignal.response

		#api_key = ENV["PSYCHSIGNAL_API_KEY"]
	 	@symbol  = params[:id]
	    #api_url = "https://api.psychsignal.com/v1/sentiments?api_key=#{api_key}&symbol=#{symbol}&from=20140901&to=20140917&period=d&format=JSON"
	    thisMonth = Date.today.at_beginning_of_month
	    nextMonth = Date.today.at_beginning_of_month.next_month
	    #puts "Words" + nextMonth.strftime("%Y-%m-%d")
	    psych_startdate = thisMonth.strftime("%Y-%m-%d")
	    psych_enddate = nextMonth.strftime("%Y-%m-%d")
	    markit_startdate = thisMonth.strftime("%Y-%m-%d") + "T00:00:00-00"
	    markit_enddate = nextMonth.strftime("%Y-%m-%d") + "T00:00:00-00"

	    psychData = Psychsignal.getSentiment(symbol, psych_startdate, psych_enddate)
	    markitData = Markit.getQuote(symbol, markit_startdate, markit_enddate)
	    #TwitterData = Twitter.getTwitter(symbol)


	    

	    # puts TwitterData
	    
	    #sentiment = HTTParty.get(api_url).parsed_response.map {|s| 
	    #	{date: s["date"], bullish: s["bullish"], bearish: s["bearish"]}
	    #}

	    quote = {"dates" => markitData["Dates"],
	    	"values" => markitData["Elements"][0]["DataSeries"]["close"]["values"], "sentiment" => psychData}


	    render json: quote
	end
	
	def create
    	@stock = Stock.create(params.require(:stock).permit(:symbol, :id))
    	if @stock.save
    		#@response = Psychsignal.response(:symbol)
    		render json: @stock #, status: :created
    	end
	end

	def new
		@stock = Stock.new	
		client = Twitter::REST::Client.new do |config|
		  config.consumer_key = '9p4SYfUNyqL7NYGodCUNL5Unb'
		  config.consumer_secret = 'TFhA3IEJdbzSsoGgu6ZHtEmQAZvmMdGRuMMbsO8khr2WokWyER'
		  config.oauth_token = '47743272-mmbSAyVudEWuFGo8ZF59foRlWDrkzigt8kE3B6bgO'
		  config.oauth_token_secret = 'EDDK0AvnGMN1DMVS0ObNfvhmfenJVEJF2iXaVtzh9Vp8W'
		end
		symbol = "aapl"
		@tweets = client.search("$"+symbol).take(20)	
	end
	
	private

	def all_stocks
		@stock = Stock.all
	end

	

end