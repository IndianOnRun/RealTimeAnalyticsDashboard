// set up the element size
var margin = {top: 10, left: 40, bottom: 40, right: 10};
var width = 700 - margin.left - margin.right;
var height = 250 - margin.top - margin.bottom;

// set up all the graphs
var now = new Date();
now.setMilliseconds(0);
now.setSeconds(0);
now = d3.time.minute.offset(now, -1);
var live_duration = 60; // in minutes
var minute_start = d3.time.minute.offset(now, -1 * live_duration);
var hour_start = d3.time.hour.offset(now, -12);
var day_start = d3.time.day.offset(now, -31);
var month_start = d3.time.month.offset(now, -12);
var year_start = d3.time.year.offset(now, -10);

// minutes
var minute_x = d3.time.scale()
    .domain([minute_start, now])
    .range([0, width*(live_duration)/(live_duration-1)]);
var minute_y = d3.scale.linear()
    .domain([0, 0])
    .range([height, 0]);
var minute_line = d3.svg.line()
    .interpolate('monotone')
    .x(function(d, i) {
        var dateArr = d.x.split('-');
        var date = new Date(dateArr[0], dateArr[1]-1, dateArr[2], dateArr[3], dateArr[4]);
        return minute_x(date);
    })
    .y(function(d, i) { return minute_y(d.y) });

// hours
var hour_x = d3.time.scale()
    .domain([hour_start, now])
    .range([0, width]);
var hour_y = d3.scale.linear()
    .domain([0, 0])
    .range([height, 0]);
var hour_line = d3.svg.line()
    .interpolate('monotone')
    .x(function(d, i) {
        var dateArr = d.x.split('-');
        var date = new Date(dateArr[0], dateArr[1]-1, dateArr[2], dateArr[3]);
        return hour_x(date);
    })
    .y(function(d, i) { return hour_y(d.y) });

// days
var day_x = d3.time.scale()
    .domain([day_start, now])
    .range([0, width]);
var day_y = d3.scale.linear()
    .domain([0, 0])
    .range([height, 0]);
var day_line = d3.svg.line()
    .interpolate('monotone')
    .x(function(d, i) {
        var dateArr = d.x.split('-');
        var date = new Date(dateArr[0], dateArr[1]-1, dateArr[2]);
        return day_x(date);
    })
    .y(function(d, i) { return day_y(d.y) });

// months
var month_x = d3.time.scale()
    .domain([month_start, now])
    .range([0, width]);
var month_y = d3.scale.linear()
    .domain([0, 0])
    .range([height, 0]);
var month_line = d3.svg.line()
    .interpolate('monotone')
    .x(function(d, i) {
        var dateArr = d.x.split('-');
        var date = new Date(dateArr[0], dateArr[1]-1, 1);
        return month_x(date);
    })
    .y(function(d, i) { return month_y(d.y) });

// years
var year_x = d3.time.scale()
    .domain([year_start, now])
    .range([0, width]);
var year_y = d3.scale.linear()
    .domain([0, 0])
    .range([height, 0]);
var year_line = d3.svg.line()
    .interpolate('monotone')
    .x(function(d, i) {
        var date = new Date(d.x, 0, 1);
        return year_x(date);
    })
    .y(function(d, i) { return year_y(d.y); });

// add graphs to the html body
var live_group = createLiveGraph(minute_x, minute_y, minute_line, 'minute');
var hour_group = createGraph(hour_x, hour_y, hour_line, 'hour');
var day_group = createGraph(day_x, day_y, day_line, 'day');
var month_group = createGraph(month_x, month_y, month_line, 'month');
var year_group = createGraph(year_x, year_y, year_line, 'year');

// get data and render lines
//initStaticGraph(live_group, minute_line, minute_start, now, 'minute');
tickMinuteGraph();
initStaticGraph(hour_group, hour_line, hour_start, now, 'hour');
initStaticGraph(day_group, day_line, day_start, now, 'day');
initStaticGraph(month_group, month_line, month_start, now, 'month');
initStaticGraph(year_group, year_line, year_start, now, 'year');

// draw the legend
// var legend = d3.select('.sidebar').select('.legend')
//     .append('table')
//     .attr('class', 'legend-table');

// var names = ['CSA', 'IIO', 'IIA', 'CAT', 'RAA', 'O2W', 'W20', 'LOO', 'LOA', 'OWW'];
// for (var i = 0; i < names.length; i++) {
//     var row = legend.append('tr')
//         .attr('class', names[i]);
//     row.append('td')
//         .text(names[i]);
//     row.append('td')
//         .append('div')
//         .attr('style', 'background-color: ' + getColor(names[i]) + '; width: 10px; height: 10px;');
//     row.append('td')
//         .attr('class', 'data');


//     var tempData = [];
//     fillZero(tempData, minute_start, now, 'minute');
//     live_group.datum.push(tempData);
//     live_group.names.push(names[i]);
//     live_group.paths.push(appendPath(live_group.path_clip, tempData, minute_line, names[i], "minute"));
// }

// request the data from rest service and draw data lines
function tickMinuteGraph() {
    var tries = 0;
    var end = new Date();
    end.setMilliseconds(0);
    end.setSeconds(0);
    start = d3.time.minute.offset(end, -1);
    $.ajax({
        url: 'http://jodhpur.indigoconsulting.com:8282/octrace/services/reporting/ts/minute/any',
        type: 'GET',
        data: 'start=' + start.getFullYear() + '-'
                       + (start.getMonth()+1) + '-'
                       + start.getDate() + '-'
                       + start.getHours() + '-'
                       + start.getMinutes() + '-'
                       + start.getSeconds() +
              '&end='  + end.getFullYear() + '-'
                       + (end.getMonth()+1) + '-'
                       + end.getDate() + '-'
                       + end.getHours() + '-'
                       + end.getMinutes() + '-'
                       + end.getSeconds(),
        success: function(response) {
            // redraw the x-axis and push it left
            live_group.x.domain([d3.time.minute.offset(end, -1*(live_duration-1)), d3.time.minute.offset(end, -1)]);
            for (var i = 0; i < response.length; i++) {
                if (response[i] == null) {
                    data = {
                            x: start.getFullYear() + '-'
                               + (start.getMonth()+1) + '-'
                               + start.getDate() + '-'
                               + start.getHours() + '-'
                               + start.getMinutes(),
                            y: 0
                    };
                } else {
                    data = response[i].data[0];
                }
                var max = 0;
                for (var k = 0; k < live_group.datum.length; k++) {
                    if (response[i] == null || live_group.names[k].localeCompare(response[i].name) == 0) {
                        live_group.datum[k].push(data);
                        var temp = findMax(live_group.datum[k]);
                        if (temp >= max) {
                            max = temp;
                            if (max == 0) max = 100;
                            live_group.y.domain([0, max]);
                            live_group.y_axis.call(d3.svg.axis().scale(live_group.y).orient('left').ticks(6));
                        }
                        // redraw the line and slide it left
                        live_group.paths[k]
                            .attr("d", minute_line)
                            .attr("transform", null)
                          .transition()
                            .duration(60*1000)
                            .ease("linear")
                            .attr("transform", "translate(" + live_group.x(d3.time.minute.offset(end, -1*live_duration)) + ", 0)");
                    }
                }
            }
            live_group.x_axis
                .call(d3.svg.axis().scale(live_group.x).orient("bottom"))
                .attr("transform", "translate(0," + live_group.y(0) + ")")
              .transition()
                .duration(60*1000)
                .ease("linear")
                .attr("transform", "translate(" + live_group.x(d3.time.minute.offset(end, -1*live_duration)) + "," + live_group.y(0) + ")")
                .each("end", tickMinuteGraph);
        }
    });
}