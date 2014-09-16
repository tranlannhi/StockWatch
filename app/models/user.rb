class User < ActiveRecord::Base
	attr_accessor :password
	attr_accessor :password_confirmation
	validates_confirmation_of :password
  	validates_presence_of :password, :on => :create
  	validates_presence_of :email
  	validates_uniqueness_of :email
	before_save :encrypt_password

	def encrypt_password
		if password.present?
			self.password_salt = BCrypt::Engine.generate_salt
			self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
		end	
	end
	
	def self.authenticate(email, password)
		user = User.where(email: email).first
		if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
			user
		else
			nil
		end
	end	
end
