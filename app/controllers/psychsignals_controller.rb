class PsychsignalsController < ApplicationController

  def index
     @response = Psychsignal.response
  end

def hello
  #### your code goes here #####
  respond_to do |format|
    format.js { render :layout=>false }
  end
end

end