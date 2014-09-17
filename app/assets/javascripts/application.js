// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require bootstrap
//= require angular

		angular.module('stockWatchApp', []).controller('stockWatchController', function($scope, $http) {
		  	
			$scope.init = function() {
				//$scope.lookupTicker();
			}

			$scope.typingTimer;
			$scope.doneTypingInterval = 700;

			$scope.searchQuote = function() {
				$scope.lookupSymbol()
					.done(function(companies) {
						var symbol = companies[0].Symbol;
						$scope.quote = $scope.getQuote(symbol);
						console.log(companies);
						//$scope.getSentiment(symbol);
					});

				//$('#div_hello').html("<%= controller.msg1 %>");
				// $("#time_div").html("some text");
			};


			$scope.autocomplete = function() {
				//console.log("Length: " + $scope.searchTerm.length);
				if ($scope.searchTerm.length >= 3) {
					clearTimeout($scope.typingTimer);
				   	$scope.typingTimer = setTimeout(
				        function(){ 
				        	console.log("Performing Lookup");
							$scope.lookupSymbol($scope.searchTerm)
								.done(function(companies) {
									$scope.$apply();
								});
				        },
				        $scope.doneTypingInterval
				    );					
				}
				else
				{
					$scope.companies = [];
				}
			};


			$scope.lookupSymbol = function(searchTerm) {
				var apiUrl = "http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=" + searchTerm;

				return $.ajax({
				        url: apiUrl,
				        dataType: "jsonp"
					}).done(function(response) {
					  	console.log("Companies: %O", response);
					  	$scope.companies = response;
					  	return $scope.companies;
					});
			};

			$scope.getQuote = function(symbol) {
				var apiUrl = "http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=" + symbol;

				return $.ajax({
					        url: apiUrl,
					        dataType: "jsonp"
						}).done(function(response) {
						  	console.log("Quote: %O", response);
						  	$scope.quoteHeader = response.Name + ": " + response.High + ", " + response.Low + ", " + response.LastPrice;
						  	$scope.$apply();
						  	return response;
						});
			};

			

			$scope.getSentiment = function(symbol) {
				var apiKey = "3c41002ea759f8dbbb0d81e714cac64f";
				var d = new Date(new Date().setDate(new Date().getDate()-2));
				var from = d.getFullYear().toString() + ("0" + (d.getMonth() + 1)).slice(-2).toString() + ("0" + d.getDate()).slice(-2).toString();
				var to = from;
				console.log("Symbol: " + symbol);
				console.log("From: " + from);

				var apiUrl = "https://api.psychsignal.com/v1/sentiments?api_key=" + apiKey + "&symbol=" + symbol + "&from=20140901&to=20140905&period=d&format=JSON";
				
				return $.ajax({
							//data: { api_key: apiKey, symbol: symbol, from: from, to: from },
					        url: apiUrl,
					        dataType: "json"
						}).done(function(response) {
						  	console.log("Sentiment: %O", response);
						  	$scope.sentiment = response;
						  	return $scope.sentiment;
						});

				
			}

			
			$scope.init();
		});
  
