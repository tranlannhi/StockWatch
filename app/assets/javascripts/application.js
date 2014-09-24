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

				$scope.searchTerm = "aapl";
				$scope.searchQuote();
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
								var stockData = $scope.getStockData(stock);
								console.log("DATAPOINTS: %O", datapoints);
								console.log("STOCK DATA: %O", stockData);
								//$scope.drawGraph(datapoints);
								$scope.drawHighChart(bullishData, '#bull-chart', ' 30 Day Bullishness');
								$scope.drawHighChart(stockData, '#stock-chart', ' Stock Chart');
								$scope.drawGauge(stock.sentiment);
								$scope.getNews();
								$scope.$apply();
							});
					});
			};


			$scope.autocomplete = function() {
				$scope.typingTimer;
				$scope.doneTypingInterval = 700;

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


			$scope.getStock = function(symbol) {
				var apiUrl = "http://0.0.0.0:3000/stocks/" + symbol;

				return $.ajax({
				        url: apiUrl
				        //dataType: "json"
					}).done(function(response) {
					  	console.log("Stock: %O", response);
					  	$scope.stock = response;
					  	$scope.$apply();
					  	return $scope.stock;
					});
			}


			/*
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
			*/


			/*
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
			*/








			/*
			var w = 600;
			var h = 250;

			var dataset = [ 
				{ key: 0, value: 5 },
				{ key: 1, value: 10 },
				{ key: 2, value: 13 },
				{ key: 3, value: 19 },
				{ key: 4, value: 21 },
				{ key: 5, value: 25 },
				{ key: 6, value: 22 },
				{ key: 7, value: 18 },
				{ key: 8, value: 15 },
				{ key: 9, value: 13 },
				{ key: 10, value: 11 },
				{ key: 11, value: 12 },
				{ key: 12, value: 15 },
				{ key: 13, value: 20 },
				{ key: 14, value: 18 },
				{ key: 15, value: 17 },
				{ key: 16, value: 16 },
				{ key: 17, value: 18 },
				{ key: 18, value: 23 },
				{ key: 19, value: 25 } ];

			var xScale = d3.scale.ordinal()
							.domain(d3.range(dataset.length))
							.rangeRoundBands([0, w], 0.05); 

			var yScale = d3.scale.linear()
							.domain([0, d3.max(dataset, function(d) {return d.value;})])
							.range([0, h]);

			var key = function(d) {
				return d.key;
			};

			//Create SVG element
			var svg = d3.select("#graph")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Create bars
			svg.selectAll("rect")
			   .data(dataset, key)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
					return xScale(i);
			   })
			   .attr("y", function(d) {
					return h - yScale(d.value);
			   })
			   .attr("width", xScale.rangeBand())
			   .attr("height", function(d) {
					return yScale(d.value);
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + (d.value * 10) + ")";
			   })

				//Tooltip
				.on("mouseover", function(d) {
					//Get this bar's x/y values, then augment for the tooltip
					var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
					var yPosition = parseFloat(d3.select(this).attr("y")) + 14;
					
					//Update Tooltip Position & value
					d3.select("#tooltip")
						.style("left", xPosition + "px")
						.style("top", yPosition + "px")
						.select("#value")
						.text(d.value);
					d3.select("#tooltip").classed("hidden", false)
				})
				.on("mouseout", function() {
					//Remove the tooltip
					d3.select("#tooltip").classed("hidden", true);
				})	;
			*/

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

			$scope.getStockData = function(stocks) {
				var stockArr = new Array();

				for (var i = 0; i < stocks.dates.length; i++) {
					stockArr.push(new Array(Date.parse(stocks.dates[i]), stocks.values[i]));
				}

				return stockArr;
			}

			$scope.getNews = function() {
				var site = 'http://finance.yahoo.com/rss/headline?s=' + $scope.symbol;
				var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=json';
				console.log(yql);
				$.get(yql).done(function (rss) {
					console.log("RSS: %O", rss.query.results.rss.channel.item);
					$scope.news = rss.query.results.rss.channel.item;
					$scope.$apply();
					/*
				    $(rss).find("item").each(function () {
				        var titulo = $(this).find('title').text();
				        console.log("TITULO: %O", titulo);
				        $('#news').append("<li>" + titulo + "</li>");
				    });
					*/
				});
			}

			$scope.drawGauge = function(sentimentArr) {
				// Remove SVG element from g1 before drawing
				//$('#g1').select("svg").remove();
				$("#g1").empty();

				var g1 = new JustGage({
		          id: "g1", 
		          value: Math.round(sentimentArr[sentimentArr.length - 1].bullish * 100) / 100, 
		          min: 0,
		          max: 4,
		          title: "Current Bullishness",
		          label: "",
		          levelColors: ["#FF0000", "#FFFF00", "#00E600"]
		        });
			}

			/*
			$scope.drawHighChart = function(data) {
				console.log("High Chart Data: %O", data);

				$('#container').highcharts('StockChart', {


			            rangeSelector : {
			                selected : 1,
			                inputEnabled: $('#container').width() > 480
			            },

			            title : {
			                text : $scope.symbol + ' Stock Price'
			            },

			            series : [{
			                name : $scope.symbol,
			                data : data,
			                tooltip: {
			                    valueDecimals: 2
			                }
			            }]
			        });
			}
			*/


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

			            series : [{
			                name : $scope.symbol,
			                data : data,
			                tooltip: {
			                    valueDecimals: 2
			                }
			            }]
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
				/*
				var data = [
				    [12345, 42345, 3234, 22345, 72345, 62345, 32345, 92345, 52345, 22345],
				    [1234, 4234, 3234, 2234, 7234, 6234, 3234, 9234, 5234, 2234]
				];
				*/

				//var data = [{"date":"2012-03-20","total":3},{"date":"2012-03-21","total":8},{"date":"2012-03-22","total":2},{"date":"2012-03-23","total":10},{"date":"2012-03-24","total":3},{"date":"2012-03-25","total":20},{"date":"2012-03-26","total":12}];


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




				  /****** BAR *****

				  var x = d3.time.scale()
				    .domain([new Date(data[0].date), d3.time.day.offset(new Date(data[data.length - 1].date), 1)])
				    .rangeRound([0, width - margin.left - margin.right]);

				var y = d3.scale.linear()
				    .domain([0, d3.max(data, function(d) { return d.total; })])
				    .range([height - margin.top - margin.bottom, 0]);

				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient('bottom')
				    .ticks(d3.time.days, 1)
				    .tickFormat(d3.time.format('%a %d'))
				    .tickSize(0)
				    .tickPadding(8);

				var yAxis = d3.svg.axis()
				    .scale(y)
				    .orient('left')
				    .tickPadding(8);

				  var svg = d3.select('#graph').append('svg')
				    .attr('class', 'chart')
				    .attr('width', width)
				    .attr('height', height)
				  .append('g')
				    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

				svg.selectAll('.chart')
				    .data(data)
				  .enter().append('rect')
				    .attr('class', 'bar')
				    .attr('x', function(d) { return x(new Date(d.date)); })
				    .attr('y', function(d) { return height - margin.top - margin.bottom - (height - margin.top - margin.bottom - y(d.total)) })
				    .attr('width', 10)
				    .attr('height', function(d) { return height - margin.top - margin.bottom - y(d.total) });

				svg.append('g')
				    .attr('class', 'x axis')
				    .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
				    .call(xAxis);

				svg.append('g')
				  .attr('class', 'y axis')
				  .call(yAxis);
				*/
				 
			}

			






			
			$scope.init();
		});
  
