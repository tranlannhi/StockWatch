
require 'httparty'
require 'twitter'

class StocksController < ApplicationController
	require 'twitter'
	before_action :all_stocks, only: [:index]
	respond_to :html, :json

	def show
		# @response = Psychsignal.response

		#api_key = ENV["PSYCHSIGNAL_API_KEY"]
	 	symbol  = params[:id]
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
	    twitterData = Twitterfeed.getFeed(symbol)
		#client.search("$"+symbol).take(20)    	
 
	     puts "TWITTER : #{twitterData}"
	    
	    #sentiment = HTTParty.get(api_url).parsed_response.map {|s| 
	    #	{date: s["date"], bullish: s["bullish"], bearish: s["bearish"]}
	    #}

	    quote = {
	    	"dates" => markitData["Dates"],
	    	"values" => markitData["Elements"][0]["DataSeries"]["close"]["values"], 
	    	"sentiment" => psychData,
	    	"tweets" => twitterData }

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
		
	end
	
	private

	def all_stocks
		@stock = Stock.all
	end

	

end