class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_filter :load_tweets

  def current_user
  	@current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def load_tweets
    @tweets = Twitter.user_timeline[0..4] 
  end
    
  helper_method :current_user
end
