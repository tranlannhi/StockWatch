class UsersController < ApplicationController
	def new
		@user = User.new
	end

	def create
		@user = User.new(user_params)
		if @user.save
			flash[:notice] = "Welcome to the site!"
			redirect_to new_stock_path
		else
			flash[:alert] = "There was a problem creating your account!"
			redirect_to :back
			#redirect_to new_stocks_path
		end
	end

	private

	def user_params
		params.require(:user).permit(:email, :password, :password_confirmation)
	end
end