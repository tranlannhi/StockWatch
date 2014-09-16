
class StocksController < ApplicationController
	def index
		@response = Psychsignal.response
	end


end