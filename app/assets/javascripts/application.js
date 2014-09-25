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

//= require_tree .
//= require bootstrap
//= require angular

		

		angular.module('stockWatchApp', [])
			.controller('stockWatchController', ['$scope', '$http', function($scope, $http) {

		  	
			$scope.init = function() {
				

				$scope.searchTerm = "aapl";
				$scope.searchQuote();

				$(function () {
				    $('#example').popover();
				});
			}



			
			$scope.searchQuote = function() {
				$scope.lookupSymbol($scope.searchTerm)
					.done(function(companies) {
						$scope.symbol = companies[0].Symbol;
						$scope.getStock($scope.symbol)
							.done(function(stock) {
								$scope.companyLabel = companies[0].Name;
								$scope.symbolLabel = companies[0].Symbol;
								$scope.stock = stock;
								var datapoints = $scope.getDataPoints(stock.sentiment);
								var bullishData = $scope.getBullishData(stock.sentiment);
								var bearishData = $scope.getBearishData(stock.sentiment);
								var stockData = $scope.getStockData(stock);
								console.log("DATAPOINTS: %O", datapoints);
								console.log("STOCK DATA: %O", stockData);
								//$scope.drawGraph(datapoints);
								//$scope.drawHighChart(bullishData, '#bull-chart', ' 30 Day Bullishness');
								$scope.drawMultiLineHighChart(bullishData, bearishData, '#bull-chart', ' 30 Day Sentiment');
								$scope.drawHighChart(stockData, '#stock-chart', ' Stock Chart');
								$scope.drawBullishGauge(stock.sentiment);
								$scope.drawBearishGauge(stock.sentiment);
								$scope.getNews();
								$scope.$apply();
							});
					});
			};

			//This function is for typeahead - not yet implement
			$scope.autocomplete = function() {
				$scope.typingTimer;
				$scope.doneTypingInterval = 700;

				//need to put the minimum length letter before it search to overcome over limit api call
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

			//checking respond from Markit On Demand
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

			//consume JSON from markitondemand/ Psychsignal/Twitter own API from stock_controller.rb
			$scope.domain = window.location.hostname;
			
			console.log($scope.domain);
			$scope.getStock = function(symbol) {
				if ($scope.domain == "http://stockmonitor.herokuapp.com") {
				// if ($scope.domain == "0.0.0.0") {
					// var apiUrl = "http://0.0.0.0:3000/stocks/" + symbol;
					// var apiUrl = "http://stockmonitor.herokuapp.com/stocks/" + symbol;
					var apiUrl = "/stocks/" + symbol;
				}
				else {
					var apiUrl = "/stocks/" + symbol;
				}

				return $.ajax({
				        url: apiUrl,
				        dataType: "json"
					}).done(function(response) {
					  	console.log("Stock: %O", response);
					  	$scope.stock = response;
					  	$scope.$apply();
					  	return $scope.stock;
					});
			}

			//ARRAY PREP FOR CHARTING STOCK QUOTE and SENTIMENT WITH HIGHCHART AND JUSTGAUGE
			
			$scope.getDataPoints = function(sentimentArr) {
				var bullishArr = new Array();

				for (var i = 0; i < sentimentArr.length; i++) {
					bullishArr.push(sentimentArr[i].bullish);
				}

				return bullishArr;
			}

			$scope.getBullishData = function(sentimentArr) {
				var bullishArr = new Array();

				for (var i = 0; i < sentimentArr.length; i++) {
					bullishArr.push(new Array(Date.parse(sentimentArr[i].date), sentimentArr[i].bullish));
				}

				return bullishArr;
			}

			$scope.getBearishData = function(sentimentArr) {
				var bearishArr = new Array();

				for (var i = 0; i < sentimentArr.length; i++) {
					bearishArr.push(new Array(Date.parse(sentimentArr[i].date), sentimentArr[i].bearish));
				}

				return bearishArr;
			}

			$scope.getStockData = function(stocks) {
				var stockArr = new Array();

				for (var i = 0; i < stocks.dates.length; i++) {
					stockArr.push(new Array(Date.parse(stocks.dates[i]), stocks.values[i]));
				}

				return stockArr;
			}

			//GET RSS YAHOO FINANCE NEWS

			$scope.getNews = function() {
				var site = 'http://finance.yahoo.com/rss/headline?s=' + $scope.searchTerm;
				var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=json';
				console.log(yql);
				$.get(yql).done(function (rss) {
					if (rss != null) {
						console.log("RSS: %O", rss.query.results.rss.channel.item);
						console.log("RSS FULL: %O", rss);
						$scope.news = rss.query.results.rss.channel.item;
						$scope.$apply();
					}
				});
			}

			//DRAW CHART WITH HIGHCHART AND JUSTGAGE LIBRARY

			$scope.drawBullishGauge = function(sentimentArr) {
				// Remove SVG element from g1 before drawing
				//$('#g1').select("svg").remove();
				$("#g4").empty();

				var bullishGauge = new JustGage({
		          id: "g4", 
		          value: Math.round(sentimentArr[sentimentArr.length - 1].bullish * 100) / 100, 
		          min: 0,
		          max: 4,
		          title: "Bullish Sentiment",
		          label: "",
		          //levelColors: ["#FF0000", "#FFFF00", "#00E600"]
		          levelColors: ["#00E600"]
		        });
			}

			$scope.drawBearishGauge = function(sentimentArr) {
				// Remove SVG element from g1 before drawing
				//$('#g1').select("svg").remove();
				$("#g5").empty();

				var bearishGauge = new JustGage({
		          id: "g5", 
		          value: Math.round(sentimentArr[sentimentArr.length - 1].bearish * 100) / 100, 
		          min: 0,
		          max: 4,
		          title: "Bearish Sentiment",
		          label: "",
		          //levelColors: ["#FF0000", "#FFFF00", "#00E600"]
		          levelColors: ["#FF0000"]
		        });

		        console.log("Bearish Gauge: %O", bearishGauge);
			}

			

			$scope.drawHighChart = function(data, tagId, title) {
				console.log("High Chart Data: %O", data);

				$(tagId).highcharts('StockChart', {

						
			            rangeSelector : {
			                selected : 1,
			                inputEnabled: $(tagId).width() > 480
			            },

			            title : {
			                text : $scope.symbol + title
			            },

			            series :
			            [
			            	{
				                name : $scope.symbol,
				                data : data,
				                tooltip: {
				                    valueDecimals: 2
				                }
			            	}
			            ]
			        });
			}


			$scope.drawMultiLineHighChart = function(bullishData, bearishData, tagId, title) {
				console.log("High Chart Bullish Data: %O", bullishData);
				console.log("High Chart Bearish Data: %O", bearishData);

				$(tagId).highcharts('StockChart', {


			            rangeSelector : {
			                selected : 1,
			                inputEnabled: $(tagId).width() > 480
			            },

			            title : {
			                text : $scope.symbol + title
			            },

			            series :
			            [
			            	{
				                name : $scope.symbol + " (Bullish)",
				                data : bullishData,
				                color: "#00E600",
				                tooltip: {
				                    valueDecimals: 2
				                }
			            	},
			            	{
				                name : $scope.symbol + " (Bearish)",
				                data : bearishData,
				                color: "#FF0000",
				                tooltip: {
				                    valueDecimals: 2
				                }
			            	}
			            ]
			        });
			}


			$scope.drawGraph = function(innerData) {
				// clear chart if already exists
				d3.select("svg").remove();

				// Check out http://jsfiddle.net/nrabinowitz/JTrnC/

				data = [
					innerData
				];
				console.log("In DrawGraph(), data: %O", data);


				var margin = {top: 30, right: 30, bottom: 30, left: 60},
				    width = 500 - margin.left - margin.right,
				    height = 300 - margin.top - margin.bottom;


				/****** LINE ******/
				var x = d3.scale.linear().domain([0, data[0].length]).range([0, width]),
				    y = d3.scale.linear().domain([0, d3.max(data[0])]).range([height, 0]);
				    xAxis = d3.svg.axis().scale(x).ticks(10),
				    yAxis = d3.svg.axis().scale(y).ticks(10).orient("left");
				

				var svg = d3.select("#graph").append("svg")
				      .attr("width", width + margin.left + margin.right)
				      .attr("height", height + margin.top + margin.bottom);


				// horizontal lines
				svg.selectAll(".hline").data(d3.range(10)).enter()
				    .append("line")
				    .attr("y1", function (d) {
				    return d * 26 + 6;
				})
				    .attr("y2", function (d) {
				    return d * 26 + 6;
				})
				    .attr("x1", function (d) {
				    return 0;
				})
				    .attr("x2", function (d) {
				    return width;
				})
				    .style("stroke", "#eee")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


				//vertical lines
				svg.selectAll(".vline").data(d3.range(21)).enter()
				    .append("line")
				    .attr("x1", function (d) {
				    return d * (width / 10);
				})
				    .attr("x2", function (d) {
				    return d * (width / 10);
				})
				    .attr("y1", function (d) {
				    return 0;
				})
				    .attr("y2", function (d) {
				    return height;
				})
				    .style("stroke", "#eee")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				    






				var line = d3.svg.line()
				    .x(function (d, i) {
				    return x(i);
				})
				    .y(function (d) {
				    return y(d);
				});

				var area = d3.svg.area()
				    .x(line.x())
				    .y1(line.y())
				    .y0(y(0));



				var lines = svg.selectAll("g")
				    .data(data);

				var aLineContainer = lines.enter().append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				aLineContainer.append("path")
				    .attr("class", "area")
				    .attr("d", area);

				aLineContainer.append("path")
				    .attr("class", "line")
				    .attr("d", line);

				aLineContainer.selectAll(".dot")
				    .data(function (d, i) {
				    return d;
				})
				    .enter()
				    .append("circle")
				    .attr("class", "dot")
				    .attr("cx", line.x())
				    .attr("cy", line.y())
				    .attr("r", 3.0);


				  // Add the x-axis.
				  svg.append("g")
				      .attr("class", "x axis")
				      .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
				      .call(xAxis);


				  // Add the y-axis.
				  svg.append("g")
				      .attr("class", "y axis")
				      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				      .call(yAxis);


			}


			
			$scope.init();
		}]);

		angular.module('stockWatchApp').directive('ngEnter', function() {
	        return function(scope, element, attrs) {
	            element.bind("keydown keypress", function(event) {
	                if(event.which === 13) {
	                    scope.$apply(function(){
	                        scope.$eval(attrs.ngEnter, {'event': event});
	                    });

	                    event.preventDefault();
	                }
	            });
	        };
	    });
  
