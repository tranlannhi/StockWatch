
require 'httparty'
require 'twitter'

class StocksController < ApplicationController
	require 'twitter'
	before_action :all_stocks, only: [:index]
	respond_to :html, :json

	def show
		
	 	symbol  = params[:id]
	 	puts symbol
	    startDate = Date.today.at_beginning_of_year
	    endDate = Date.today.at_beginning_of_year.next_year
	    psych_startdate = startDate.strftime("%Y-%m-%d")
	    psych_enddate = endDate.strftime("%Y-%m-%d")
	    markit_startdate = startDate.strftime("%Y-%m-%d") + "T00:00:00-00"
	    markit_enddate = endDate.strftime("%Y-%m-%d") + "T00:00:00-00"

	    psychData = Psychsignal.getSentiment(symbol, psych_startdate, psych_enddate)
	    markitData = Markit.getQuote(symbol, markit_startdate, markit_enddate)
	    twitterData = Twitterfeed.getFeed(symbol)
 
	     puts "TWITTER : #{twitterData}"
	    
	    

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