// JavaScript Document
// create the controller and inject Angular's $scope
dashboardApp.controller('mainController', function($scope, $http) {
		// create a message to display in our view
		$scope.message = 'Dashboard Analytics';
	});

dashboardApp.controller('realTimeCtrl', function($scope, $http) {
    $scope.data = []
    $scope.options = {
              chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function(d){ return d[0]; },
                y: function(d){ return d[1]/100; },
                average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                transitionDuration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,

                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%M')(new Date(d))
                    },
                    showMaxMin: false,
                    staggerLabels: true
                },

                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format(',.1%')(d);
                    },
                    axisLabelDistance: 20
                },
            },
              title: {   
              "enable": true,
              "text": "Real-Time"
            }
        };

      $scope.options1 = angular.copy($scope.options);
      $scope.options1.chart.transitionDuration = 1;

        var current = new Date();
        var currentMonth = current.getMonth() + 1;
        var currentYear = current.getFullYear();
        var currentDate = current.getDate();
        var currentDateNumber = currentDate;
        var currentTime = current.getHours()
                          + '-' +current.getMinutes()
                          + '-' +current.getSeconds();


     $http.get('services/reporting/ts/any?start='
                +currentYear+'-'
                +currentMonth+'-'
                +currentDate+'-00-00-00&end='
                +currentYear+'-'
                +currentMonth+'-'
                +currentDate+'-'
                +currentTime)
        .success(function(datum){
        
            $scope.first;
            
            $scope.second = [];
            $scope.third;

            for (var i in datum){
              $scope.valuelimit = datum[i].values.length;
              $scope.first = '{"key":"'+datum[i].key+'","values":[';
              $scope.output = [];
              
              $scope.valuesend;

              $scope.totallength = datum.length;

                for(var j in datum[i].values){

                  $scope.output += '['+datum[i].values[j].x+','+datum[i].values[j].y+']';
                  //console.log(datum[i].values[j].x);
                  //console.log(datum[i].values.length);

                  if (datum[i].values.length != 1)  {
                    //console.log("j= "+j);
                    //console.log("datum[i].values.length "+datum[i].values.length);
                    if(j < $scope.valuelimit-1)
                    {
                      //console.log("j= "+j);
                      $scope.output = $scope.output+',';
                      //console.log($scope.output);
                    }
                    else $scope.output = $scope.output+']';
                  }
                  else $scope.output = $scope.output+']';


                //  console.log($scope.output);
                  
              }
              //console.log($scope.output);
              $scope.second += $scope.first + $scope.output + '}';

              if (i < $scope.totallength-1) {
                    $scope.second = $scope.second+ ',';
              }  
              else  $scope.second = '['+$scope.second+']';

              
              //console.log($scope.second);
            }

            $scope.my_obj = JSON.parse($scope.second);
            $scope.data = $scope.my_obj;

            setInterval(function(){
            if ($scope.data[0].values.length > 50) $scope.data[0].values.shift();
            x++;
            $scope.$apply();
            }, 500);    
            //$scope.data = $scope.second;
            //$scope.data = $scope.second;                        //console.log($scope.second);


            console.log($scope.data);

        
        })

        .error(function(datum,status,error,config){
            $scope.data = [{heading:"Error",description:"Could not load json data"}];
        });
});

dashboardApp.controller('hourlyCtrl', function($scope, $http) {
    $scope.data = []
    $scope.options = {
              chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function(d){ return d[0]; },
                y: function(d){ return d[1]/100; },
                average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                transitionDuration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,

                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%I %p')(new Date(d))
                    },
                    showMaxMin: false,
                    staggerLabels: true
                },

                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format(',.1%')(d);
                    },
                    axisLabelDistance: 20
                }
            },
              title: {   
              "enable": true,
              "text": "Hourly"
            }
        };

        var current = new Date();
        var currentMonth = current.getMonth() + 1;
        var currentYear = current.getFullYear();
        var currentDate = current.getDate();
        var currentDateNumber = currentDate;
        var currentTime = current.getHours()
                          + '-' +current.getMinutes()
                          + '-' +current.getSeconds();
        //console.log(currentDateNumber - 1);

        var startDate = currentDateNumber;
        var count = 7;

        for (var count = 0; count != 7; count++){
          if (startDate!= 1){
            startDate = --startDate;
          }
          else break;
          
        }

     $http.get('services/reporting/ts/any?start='
                +currentYear+'-'
                +currentMonth+'-'
                +currentDate+'-00-00-00&end='
                +currentYear+'-'
                +currentMonth+'-'
                +currentDate+'-'
                +currentTime)
        .success(function(datum){
        
            $scope.first;
            
            $scope.second = [];
            $scope.third;

            for (var i in datum){
              $scope.valuelimit = datum[i].values.length;
              $scope.first = '{"key":"'+datum[i].key+'","values":[';
              $scope.output = [];
              
              $scope.valuesend;

              $scope.totallength = datum.length;

                for(var j in datum[i].values){

                  $scope.output += '['+datum[i].values[j].x+','+datum[i].values[j].y+']';
                  //console.log(datum[i].values[j].x);
                  //console.log(datum[i].values.length);

                  if (datum[i].values.length != 1)  {
                    //console.log("j= "+j);
                    //console.log("datum[i].values.length "+datum[i].values.length);
                    if(j < $scope.valuelimit-1)
                    {
                      //console.log("j= "+j);
                      $scope.output = $scope.output+',';
                      //console.log($scope.output);
                    }
                    else $scope.output = $scope.output+']';
                  }
                  else $scope.output = $scope.output+']';


                //  console.log($scope.output);
                  
              }
              //console.log($scope.output);
              $scope.second += $scope.first + $scope.output + '}';

              if (i < $scope.totallength-1) {
                    $scope.second = $scope.second+ ',';
              }  
              else  $scope.second = '['+$scope.second+']';

              
              //console.log($scope.second);
            }

            $scope.my_obj = JSON.parse($scope.second);
            $scope.data = $scope.my_obj;
            //$scope.data = $scope.second;
            //$scope.data = $scope.second;                        //console.log($scope.second);


            console.log($scope.data);

        
        })

        .error(function(datum,status,error,config){
            $scope.data = [{heading:"Error",description:"Could not load json data"}];
        });
});

dashboardApp.controller('weeklyCtrl', function($scope, $http) {
    $scope.options = {
              chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function(d){ return d[0]; },
                y: function(d){ return d[1]/100; },
                average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                transitionDuration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,

                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%a %d')(new Date(d))
                    },
                    showMaxMin: false,
                    staggerLabels: true
                },

                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format(',.1%')(d);
                    },
                    axisLabelDistance: 20
                }
            },
            title: {   
              "enable": true,
              "text": "Weekly"
            }
        };

        var current = new Date();
        var currentMonth = current.getMonth() + 1;
        var currentYear = current.getFullYear();
        var currentDate = current.getDate();
        var currentDateNumber = currentDate;
        var currentTime = current.getHours()
                          + '-' +current.getMinutes()
                          + '-' +current.getSeconds();
        //console.log(currentDateNumber - 1);

        var startDate = currentDateNumber;
        var count = 7;

        for (var count = 0; count != 7; count++){
          if (startDate!= 1){
            startDate = --startDate;
          }
          else break;
          
        }
        console.log(startDate);

    $http.get('services/reporting/ts/any?start='+currentYear+'-'+currentMonth+'-'+startDate+'-00-00-00&end='+currentYear+'-'+currentMonth+'-'+currentDate+'-'+currentTime)
        .success(function(datum){
        
            $scope.first;
            
            $scope.second = [];
            $scope.third;

            for (var i in datum){
              $scope.valuelimit = datum[i].values.length;
              $scope.first = '{"key":"'+datum[i].key+'","values":[';
              $scope.output = [];
              
              $scope.valuesend;

              $scope.totallength = datum.length;

                for(var j in datum[i].values){

                  $scope.output += '['+datum[i].values[j].x+','+datum[i].values[j].y+']';
                  //console.log(datum[i].values[j].x);
                  //console.log(datum[i].values.length);

                  if (datum[i].values.length != 1)  {
                    //console.log("j= "+j);
                    //console.log("datum[i].values.length "+datum[i].values.length);
                    if(j < $scope.valuelimit-1)
                    {
                      //console.log("j= "+j);
                      $scope.output = $scope.output+',';
                      //console.log($scope.output);
                    }
                    else $scope.output = $scope.output+']';
                  }
                  else $scope.output = $scope.output+']';


                //  console.log($scope.output);
                  
              }
              //console.log($scope.output);
              $scope.second += $scope.first + $scope.output + '}';

              if (i < $scope.totallength-1) {
                    $scope.second = $scope.second+ ',';
              }  
              else  $scope.second = '['+$scope.second+']';

              
              //console.log($scope.second);
            }

            $scope.my_obj = JSON.parse($scope.second);
            $scope.data = $scope.my_obj;
            //$scope.data = $scope.second;
            //$scope.data = $scope.second;                        //console.log($scope.second);


            console.log($scope.data);

        
        })

        .error(function(datum,status,error,config){
            $scope.data = [{heading:"Error",description:"Could not load json data"}];
        });
});

dashboardApp.controller('monthlyCtrl', function($scope, $http) {
    $scope.options = {
              chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function(d){ return d[0]; },
                y: function(d){ return d[1]/100; },
                average: function(d) { return d.mean/100; },

                color: d3.scale.category10().range(),
                transitionDuration: 300,
                useInteractiveGuideline: true,
                clipVoronoi: false,

                xAxis: {
                    axisLabel: 'X Axis',
                    tickFormat: function(d) {
                        return d3.time.format('%B')(new Date(d))
                    },
                    //tickValues: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    showMaxMin: false,
                    staggerLabels: true
                },

                yAxis: {
                    axisLabel: 'Y Axis',
                    tickFormat: function(d){
                        return d3.format(',.1%')(d);
                    },
                    axisLabelDistance: 20
                }
            },
            title: {   
              "enable": true,
              "text": "Monthly"
            }
        };


        var current = new Date();
        var currentMonth = current.getMonth() + 1;
        var currentYear = current.getFullYear();
        var currentDate = current.getDate();
        var currentDateNumber = currentDate;
        var currentTime = current.getHours()
                          + '-' +current.getMinutes()
                          + '-' +current.getSeconds();

        
    $http.get('services/reporting/ts/any?start='
                +currentYear+'-0-0-00-00-00&end='
                +currentYear+'-'
                +currentMonth+'-'
                +currentDate+'-'
                +currentTime)

        .success(function(datum){
         
            $scope.first;
            
            $scope.second = [];
            $scope.third;

            for (var i in datum){
              $scope.valuelimit = datum[i].values.length;
              $scope.first = '{"key":"'+datum[i].key+'","values":[';
              $scope.output = [];
              
              $scope.valuesend;

              $scope.totallength = datum.length;

                for(var j in datum[i].values){

                  var xvalue = 
                  $scope.output += '['+datum[i].values[j].x+','+datum[i].values[j].y+']';
                  //console.log(datum[i].values[j].x);
                  //console.log(datum[i].values.length);

                  if (datum[i].values.length != 1)  {
                    //console.log("j= "+j);
                    //console.log("datum[i].values.length "+datum[i].values.length);
                    if(j < $scope.valuelimit-1)
                    {
                      //console.log("j= "+j);
                      $scope.output = $scope.output+',';
                      //console.log($scope.output);
                    }
                    else $scope.output = $scope.output+']';
                  }
                  else $scope.output = $scope.output+']';


                //  console.log($scope.output);
                  
              }
              //console.log($scope.output);
              $scope.second += $scope.first + $scope.output + '}';

              if (i < $scope.totallength-1) {
                    $scope.second = $scope.second+ ',';
              }  
              else  $scope.second = '['+$scope.second+']';

              
              //console.log($scope.second);
            }

            $scope.my_obj = JSON.parse($scope.second);
            $scope.data = $scope.my_obj;

            

          // console.log($scope.appendc2);
          // $scope.data = datum;


        
        })

        .error(function(datum,status,error,config){
            $scope.data = [{heading:"Error",description:"Could not load json data"}];
        });
   
});

dashboardApp.controller('pieChartCtrl', function($scope){

        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 400,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                transitionDuration: 500,
                labelThreshold: 0.01,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "Android",
                y: 50
            },
            {
                key: "iOS",
                y: 20
            },
        ];
    })

dashboardApp.controller('multilineController', ['$scope', '$interval', function($scope, $interval){
  $scope.multilineData=[
  {month: Feb, eut: CSA, count: 8},
  {month: Mar, eut: CSA, count: 8},
  {month: May, eut: CSA, count: 8},
  {month: June, eut: CSA, count: 8},
  {month: April, eut: CSA, count: 8}]
  }]);


dashboardApp.value('dateRangePickerConfig', {
  separator: ' - ',
  format: 'YYYY-MM-DD'
});

dashboardApp.directive('dateRangePicker', [
  '$compile', '$timeout', '$parse', 'dateRangePickerConfig', function($compile, $timeout, $parse, defaults) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        dateMin: '=min',
        dateMax: '=max',
        opts: '=options'
      },
      link: function($scope, element, attrs, modelCtrl) {
        var customOpts, el, opts, _formatted, _getPicker, _init, _validateMax, _validateMin;
        el = $(element);
        customOpts = $parse(attrs.dateRangePicker)($scope, {});
        opts = angular.extend(defaults, customOpts);
        _formatted = function(viewVal) {
          var f;
          f = function(date) {
            if (!moment.isMoment(date)) {
              return moment(date).format(opts.format);
            }
            return date.format(opts.format);
          };
          return [f(viewVal.startDate), f(viewVal.endDate)].join(opts.separator);
        };
        _validateMin = function(min, start) {
          var valid;
          min = moment(min);
          start = moment(start);
          valid = min.isBefore(start) || min.isSame(start, 'day');
          modelCtrl.$setValidity('min', valid);
          return valid;
        };
        _validateMax = function(max, end) {
          var valid;
          max = moment(max);
          end = moment(end);
          valid = max.isAfter(end) || max.isSame(end, 'day');
          modelCtrl.$setValidity('max', valid);
          return valid;
        };
        modelCtrl.$formatters.unshift(function(val) {
          var picker;
          if (val && val.startDate && val.endDate) {
            picker = _getPicker();
            picker.setStartDate(val.startDate);
            picker.setEndDate(val.endDate);
            return val;
          }
          return '';
        });
        modelCtrl.$parsers.unshift(function(val) {
          if (!angular.isObject(val) || !(val.hasOwnProperty('startDate') && val.hasOwnProperty('endDate'))) {
            return modelCtrl.$modelValue;
          }
          if ($scope.dateMin && val.startDate) {
            _validateMin($scope.dateMin, val.startDate);
          } else {
            modelCtrl.$setValidity('min', true);
          }
          if ($scope.dateMax && val.endDate) {
            _validateMax($scope.dateMax, val.endDate);
          } else {
            modelCtrl.$setValidity('max', true);
          }
          return val;
        });
        modelCtrl.$isEmpty = function(val) {
          return !val || (val.startDate === null || val.endDate === null);
        };
        modelCtrl.$render = function() {
          if (!modelCtrl.$viewValue) {
            return el.val('');
          }
          if (modelCtrl.$viewValue.startDate === null) {
            return el.val('');
          }
          return el.val(_formatted(modelCtrl.$viewValue));
        };
        _init = function() {
          return el.daterangepicker(opts, function(start, end, label) {
            return $timeout(function() {
              return $scope.$apply(function() {
                modelCtrl.$setViewValue({
                  startDate: start.toDate(),
                  endDate: end.toDate()
                });
                return modelCtrl.$render();
              });
            });
          });
        };
        _getPicker = function() {
          return el.data('daterangepicker');
        };
        _init();
        el.change(function() {
          if ($.trim(el.val()) === '') {
            return $timeout(function() {
              return $scope.$apply(function() {
                return modelCtrl.$setViewValue({
                  startDate: null,
                  endDate: null
                });
              });
            });
          }
        });
        if (attrs.min) {
          $scope.$watch('dateMin', function(date) {
            if (date) {
              if (!modelCtrl.$isEmpty(modelCtrl.$viewValue)) {
                _validateMin(date, modelCtrl.$viewValue.startDate);
              }
              opts['minDate'] = moment(date);
            } else {
              opts['minDate'] = false;
            }
            return _init();
          });
        }
        if (attrs.max) {
          $scope.$watch('dateMax', function(date) {
            if (date) {
              if (!modelCtrl.$isEmpty(modelCtrl.$viewValue)) {
                _validateMax(date, modelCtrl.$viewValue.endDate);
              }
              opts['maxDate'] = moment(date);
            } else {
              opts['maxDate'] = false;
            }
            return _init();
          });
        }
        if (attrs.options) {
          return $scope.$watch('opts', function(newOpts) {
            opts = angular.extend(opts, newOpts);
            return _init();
          });
        }
      }
    };
  }
]);



dashboardApp.directive('linearChart', function($parse, $window){
   return{
      restrict:'EA',
      template:"<svg width='500' height='200'></svg>",
       link: function(scope, elem, attrs){
           var exp = $parse(attrs.chartData);

           var demoDataToPlot=exp(scope);
           var padding = 20;
           var pathClass="path";
           var xScale, yScale, xAxisGen, yAxisGen, lineFun;

           var d3 = $window.d3;
           var rawSvg=elem.find('svg');
           var svg = d3.select(rawSvg[0]);

           scope.$watchCollection(exp, function(newVal, oldVal){
               demoDataToPlot=newVal;
               redrawLineChart();
           });

            function setChartParameters(){

               xScale = d3.scale.linear()
                   .domain([demoDataToPlot[0].hour, demoDataToPlot[demoDataToPlot.length-1].hour])
                   .range([padding + 5, rawSvg.attr("width") - padding]);

               yScale = d3.scale.linear()
                   .domain([0, d3.max(demoDataToPlot, function (d) {
                       return d.demo;
                   })])
                   .range([rawSvg.attr("height") - padding, 0]);

               xAxisGen = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(demoDataToPlot.length - 1);

               yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5);

               lineFun = d3.svg.line()
                   .x(function (d) {
                       return xScale(d.hour);
                   })
                   .y(function (d) {
                       return yScale(d.demo);
                   })
                   .interpolate("basis");
           }
         
          function drawLineChart() {

               setChartParameters();

               svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0,180)")
                   .call(xAxisGen);

               svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(20,0)")
                   .call(yAxisGen);

               svg.append("svg:path")
                   .attr({
                       d: lineFun(demoDataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });
           }

           function redrawLineChart() {

               setChartParameters();

               svg.selectAll("g.y.axis").call(yAxisGen);

               svg.selectAll("g.x.axis").call(xAxisGen);

               svg.selectAll("."+pathClass)
                   .attr({
                       d: lineFun(demoDataToPlot)
                   });
           }

           drawLineChart();
       }
   };
});

dashboardApp.controller('mobSearchCtrl', function($scope, $http) {
    // create a message to display in our view
   

    $scope.searchData = {

    }
    
    $scope.date = {startDate: null, endDate: null};
    $scope.mobilenumber;
    $scope.sessions = [];
    $scope.sessionDetails = [];
    // $scope.selectedStartDate = new Date();
    // $scope.selectedEndDate = new Date();
    
    $scope.loadSession = function(mobilenumber, date) {
      console.log(mobilenumber);
      console.log(date);
      $scope.mobilenumber = mobilenumber;
      

      var startyear = date.startDate.getFullYear();
      var startmonth = date.startDate.getMonth() + 1;
      var startday = date.startDate.getDate();
      var starthour = date.startDate.getHours();
      var startminute = date.startDate.getMinutes();
      var startsecond = date.startDate.getSeconds();

      var endyear = date.endDate.getFullYear();
      var endmonth = date.endDate.getMonth() + 1;
      var endday = date.endDate.getDate();
      var endhour = date.endDate.getHours();
      var endminute = date.endDate.getMinutes();
      var endsecond = date.endDate.getSeconds();

      $scope.selectedStartDate = startyear+ "-" +startmonth+ "-" +startday+ "-" +starthour+ "-" +startminute+ "-" +startsecond;

      $scope.selectedEndDate = endyear+ "-" +endmonth+ "-" +endday+ "-" +endhour+ "-" +endminute+ "-" +endsecond;

      //$filter('date')(date.startDate, 'yyyy-MM-dd');
      console.log(date.startDate);
      //$scope.selectedStartDate = (date.startDate | date:'yyyy-MM-dd HH:mm:ss');
      // $scope.selectedEndDate = date.endDate;
          $http.get('services/reporting/mdn/'+$scope.mobilenumber+'?start='+$scope.selectedStartDate+'&end='+$scope.selectedEndDate).success(function(sessiondata,status) {
            console.log(sessiondata);
          $scope.sessions = sessiondata;
            });

    };

    $scope.loadSessionData = function(sid) {
          $scope.sid = sid;
          console.log(sid);
          $http.get('services/reporting/sid/'+$scope.sid).success(function(data,status) {
          $scope.sessionDetails = data;
            });
    };

  });

dashboardApp.controller('sidSearchCtrl', function($scope, $http) {
    // create a message to display in our view
    
    $scope.sessionDetails = [];
    // $scope.selectedStartDate = new Date();
    // $scope.selectedEndDate = new Date();
    
    $scope.loadSidSession = function(sid) {
      $scope.sid = sid;
      console.log($scope.sid)
      $http.get('pages/'+$scope.sid).success(function(data,status) {
        $scope.sessionDetails = data;

        // var predata;
        // for(var j in data){
        //   console.log(data[j].failure);
        //   console.log(data[j]);
        //   if (data[j].failure == true) {
        //      predata = data[j];
        //      console.log("Predata = "+predata);
        //      //console.log("sessionD="+$scope.sessionDetails);
        //   }
        // }

        //$scope.sessionDetails;
      });
    };
  });

dashboardApp.controller('homeController', ['$scope', '$routeParams',
  function($scope, $routeParams) {
	  //alert('hi');
    $scope.phoneId = $routeParams.phoneId;
  }]);
  