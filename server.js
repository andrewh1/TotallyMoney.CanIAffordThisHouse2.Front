var http = require('http');
var express = require('express');
var swig = require('swig');
var app = express();
var numeral = require('numeral');

var port = process.env.PORT || 1100;
var apiaddress = "totallymoneycaniaffordthishouse.apphb.com";

//app.use(express.favicon());
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/app');
app.use("/can-i-afford-to-buy/css", express.static(__dirname + '/css'));
app.use("/can-i-afford-to-buy/styles", express.static(__dirname + '/app/styles'));
app.use("/can-i-afford-to-buy/scripts", express.static(__dirname + '/app/scripts'));	
//app.set('view cache', false);
//swig.setDefaults({ cache: false });

app.get('/can-i-afford-to-buy/', function (req, res) {
	
	var requestOptions = {
		host : apiaddress,
		path : '/api/showareas',
		port : 80,
		method: 'GET'
	}

	var request = http.request(requestOptions, function(response){
		var body="";

		response.on('data', function(data) {
			body += data;
		});		
		
		response.on('end', function() {
			var jsonareas = JSON.parse(body);
			//console.log(jsonareas);
			res.render("index", { areas: jsonareas } );
		});
	});

	request.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
		console.log(e.stack);
	});
	request.end();
});

app.get('/can-i-afford-to-buy/GetResults', function (req, res) {
	var qs = req.url.substr(req.url.indexOf('?'));
	var requestOptions = {
		host : apiaddress,
		path : '/api/calculate/'+ qs,
		port : 80,
		method: 'GET'
	}

	var request = http.request(requestOptions, function(response){
		var body="";

		response.on('data', function(data) {
			body += data;
		});		
		
		response.on('end', function() {
			var jsonresults = JSON.parse(body);
			jsonresults.AvHousePrice = numeral(parseFloat(jsonresults.AvHousePrice).toFixed(2)).format('0,0');
			jsonresults.AvMonthlyPaymentNeeded = numeral(parseFloat(jsonresults.AvMonthlyPaymentNeeded).toFixed(2)).format('0,0');
			
			jsonresults.MonthlyPaymentNeededOneYear = numeral(parseFloat(jsonresults.MonthlyPaymentNeededOneYear).toFixed(2)).format('0,0');
			jsonresults.MonthlyPaymentNeededFiveYears = numeral(parseFloat(jsonresults.MonthlyPaymentNeededFiveYears).toFixed(2)).format('0,0');
			jsonresults.MonthlyPaymentNeededTenYears = numeral(parseFloat(jsonresults.MonthlyPaymentNeededTenYears).toFixed(2)).format('0,0');
			
			jsonresults.CheaperAreaMonthlyPaymentsOneYear = numeral(parseFloat(jsonresults.CheaperAreaMonthlyPaymentsOneYear).toFixed(2)).format('0,0');
			jsonresults.CheaperAreaMonthlyPaymentsFiveYear = numeral(parseFloat(jsonresults.CheaperAreaMonthlyPaymentsFiveYear).toFixed(2)).format('0,0');
			jsonresults.CheaperAreaMonthlyPaymentsTenYear = numeral(parseFloat(jsonresults.CheaperAreaMonthlyPaymentsTenYear).toFixed(2)).format('0,0');
			
			//console.log(jsonresults);
			if(jsonresults.CanYouAffordIt)
			{
				if(jsonresults.TimeInMonths <= 12)
					res.render("canafforditinoneyear", { results: jsonresults } );
				
				if(jsonresults.TimeInMonths > 12 && jsonresults.TimeInMonths <= 59)
					res.render("canafforditone-fiveyears", { results: jsonresults } );
				
				if(jsonresults.TimeInMonths > 59 && jsonresults.TimeInMonths <= 119)
					res.render("canafforditfive-tenyears", { results: jsonresults } );
				
				if(jsonresults.TimeInMonths > 119)
					res.render("canafforditover-tenyears", { results: jsonresults } );				
			}
				
			else
				res.render("cannotaffordit", { results: jsonresults } );
		});
	});

	request.on('error', function(e) {
		console.log('Problem with request: ' + e.message);
		console.log(e.stack);
	});
	request.end();
});


app.listen(port, function(){
    console.log('Listening on '+ port );
});
