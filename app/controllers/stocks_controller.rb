
require 'httparty'

class StocksController < ApplicationController
	before_action :all_stocks, only: [:index]
	respond_to :html, :json

	def show
		# @response = Psychsignal.response

		api_key = ENV["PSYCHSIGNAL_API_KEY"]
	 	symbol  = params[:id]
	    api_url = "https://api.psychsignal.com/v1/sentiments?api_key=#{api_key}&symbol=#{symbol}&from=20140901&to=20140905&period=d&format=JSON"
	    data = Markit.getQuote(symbol)
	    raise ({"dates" => data["Dates"],
	    	"values" => data["Elements"][0]["DataSeries"]["close"]["values"]}).inspect
	    
#	    render json: HTTParty.get(api_url)
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