// JavaScript Document

	// create the module and name it scotchApp
	var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'nvd3']);

	// configure our routes
	dashboardApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			.when('/real-time', {
				templateUrl : 'pages/real-time.html',
				controller  : 'realTimeCtrl'
			})

			.when('/hourly', {
				templateUrl : 'pages/hourly.html',
				controller  : 'hourlyCtrl'
			})

			.when('/weekly', {
				templateUrl : 'pages/weekly.html',
				controller  : 'weeklyCtrl'
			})
			.when('/monthly', {
				templateUrl : 'pages/monthly.html',
				controller  : 'monthlyCtrl'
			})
			.when('/mobilesearch', {
				templateUrl : 'pages/mobilesearch.html',
				controller  : 'mobSearchCtrl'
			})
			.when('/sidsearch', {
				templateUrl : 'pages/sidsearch.html',
				controller  : 'sidSearchCtrl'
			});
	});

	