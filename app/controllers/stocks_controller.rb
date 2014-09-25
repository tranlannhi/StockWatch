
require 'httparty'
require 'twitter'

class StocksController < ApplicationController
	require 'twitter'
	before_action :all_stocks, only: [:index]
	respond_to :html, :json

	def show
		
	 	symbol  = params[:id]
	 	# puts symbol TO SEE IF IT GET THE RIGHT ID
	    startDate = Date.today.at_beginning_of_year
	    endDate = Date.today.at_beginning_of_year.next_year
	    # SET PSYCHSIGNAL START DATE AND END DATE TO GET DATA FROM ITS API
	    psych_startdate = startDate.strftime("%Y-%m-%d")
	    psych_enddate = endDate.strftime("%Y-%m-%d")
	    # SET DATE FORMAT MARKIT ON DEMAND 
	    markit_startdate = startDate.strftime("%Y-%m-%d") + "T00:00:00-00"
	    markit_enddate = endDate.strftime("%Y-%m-%d") + "T00:00:00-00"

	    psychData = Psychsignal.getSentiment(symbol, psych_startdate, psych_enddate)
	    markitData = Markit.getQuote(symbol, markit_startdate, markit_enddate)

	    #GETTING TWEETING FEED FOR THE SYMBOL
	    twitterData = Twitterfeed.getFeed(symbol)
 
	     puts "TWITTER : #{twitterData}"
	    
	    # EXPORT AS JSON TO CONSUME

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