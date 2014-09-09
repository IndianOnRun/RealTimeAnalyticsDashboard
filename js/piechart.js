    var calendar = [
        ["January", 31],
        ["February", 28],
        ["March", 31],
        ["April", 30],
        ["May", 31],
        ["June", 30],
        ["July", 31],
        ["August", 31],
        ["September", 30],
        ["October", 31],
        ["November", 30],
        ["December", 31]
        ];

    var sel_month_1 = document.createElement('select'),
        sel_day_1 = document.createElement('select');

    var sel_month_2 = document.createElement('select'),
        sel_day_2 = document.createElement('select');

    function createOption(txt, val) {
        var option = document.createElement('option');
        option.value = val;
        option.appendChild(document.createTextNode(txt));
        return option;
    }

    function clearChildren(ele) {
        while (ele.hasChildNodes()) {
            ele.removeChild(ele.lastChild);
        }
    }

    function recalculateDays(sel_month, sel_day) {
        var month_index = sel_month.value,
            df = document.createDocumentFragment();
        for (var i = 0, l = calendar[month_index][1]; i < l; i++) {
            df.appendChild(createOption(i + 1, i));
        }
        clearChildren(sel_day);
        sel_day.appendChild(df);
    }

    function generateMonths(sel_month) {
        var df = document.createDocumentFragment();
        calendar.forEach(function(info, i) {
            df.appendChild(createOption(info[0], i));
        });
        clearChildren(sel_month);
        sel_month.appendChild(df);
    }

    sel_month_1.onchange = function() {recalculateDays(sel_month_1, sel_day_1);};
    sel_month_2.onchange = function() {recalculateDays(sel_month_2, sel_day_2);};
    sel_day_2.onchange = updateChart;

    generateMonths(sel_month_1);
    generateMonths(sel_month_2);
    recalculateDays(sel_month_1, sel_day_1);
    recalculateDays(sel_month_2, sel_day_2);

    document.getElementById('cal-1').appendChild(sel_month_1);
    document.getElementById('cal-1').appendChild(sel_day_1);
    document.getElementById('cal-2').appendChild(sel_month_2);
    document.getElementById('cal-2').appendChild(sel_day_2);


 var w = 300;
    h = 300;
    r = 100;
    color = d3.scale.category20c();
 
data = [{'label':'iOS', 'value':20},
        {'label':'Desktop', 'value':50},
        {'label':'Android', 'value':30}];

var main = d3.select('body').select('.graph-container')
    .append('svg:svg')
    .attr('class', 'piechart')
    .data([data]) 
    .attr('width', w) 
    .attr('height', h);

var vis = main
    .append('svg:g') 
    .attr('transform', 'translate(' + r + ',' + r + ')') 
 
var arc = d3.svg.arc() 
    .outerRadius(r);
 
var pie = d3.layout.pie() 
    .value(function(d) { return d.value; }); 
 
var arcs = vis.selectAll('g.slice') 
    .data(pie) 
    .enter() 
    .append('svg:g') 
    .attr('class', 'slice'); 
 
var arcPath = arcs.append('svg:path')
    .attr('fill', function(d, i) { return color(i); } ) 
    .attr('d', arc); 
 
arcs.append('svg:text') 
    .attr('transform', function(d) { 
        d.innerRadius = 0;
        d.outerRadius = r;
        return 'translate(' + arc.centroid(d) + ')'; 
    })
    .attr('text-anchor', 'middle') 
    .text(function(d, i) { return data[i].label; }); 

function updateChart() {
    data = [{'label':'iOS', 'value':(Math.random()+1)*20},
        {'label':'Desktop', 'value':(Math.random()+1)*50},
        {'label':'Android', 'value':(Math.random()+1)*30}];
    main.data([data]);
    pie.value(function(d) { return d.value; }); 
    arcs.data(pie);
    arcPath.attr('d', arc);
    console.log('update');
}