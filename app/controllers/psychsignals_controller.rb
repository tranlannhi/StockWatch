class PsychsignalsController < ApplicationController

  def index
     @response = Psychsignal.response
  end

end