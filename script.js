// Setting Dimensions
var margin = { top: 20, right: 20, bottom: 70, left: 50 },
    width = 600 - margin.left - margin.right,
    height =600 - margin.top - margin.bottom;
// Set the range
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
// Tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
function get_stats(d) {
    $("#pop_density").html(String(Math.round(d.pop_density*10)/10) +" per sq. mile");
    $("#median_income").html(String(Math.round(d.median_income*10)/10)+" $");
    $("#median_age").html(String(Math.round(d.median_age*10)/10) +" years");
    $("#pct_min").html(String(Math.round(d.pct_min*10)/10) +" %");
    $("#over60").html(String(Math.round(d.over60*10)/10) + " %");

}
// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin


var t = d3.transition()
.duration(750);

function plotLine(fips){
 // Template from https://bl.ocks.org/mbostock/3883245
 d3.select("svg#linechart").selectAll("*").remove();


 var svg = d3.select('#linechart'),
 margin = {top: 20, right: 20, bottom: 30, left: 50},
 width = parseInt(svg.attr("width"))*screen.width/100 - margin.left - margin.right,
 height = 150 - margin.top - margin.bottom,
 g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
 
 var parseTime = d3.timeParse('%Y-%m-%d');
 var x = d3.scaleTime()
   .rangeRound([0, width]);
 
 var y = d3.scaleLinear()
   .rangeRound([height, 0]);
 
 var line = d3.line()
   .x(function(d) { return x(d.date); })
   .y(function(d) { return y(d.cases); });
 
 d3.csv('dailydata/'+fips+'.csv').then(function(data){
    data.forEach(function (d) {
        d.date = parseTime(d.date);
        d.cases = +d.cases;
       


    });
   

 x.domain(d3.extent(data, function(d) { return d.date; }));
 y.domain(d3.extent(data, function(d) { return d.cases; }));
 
   g.append('g')
       .attr('transform', 'translate(0,' + height + ')')
       .call(d3.axisBottom(x))
     .select('.domain')
       .remove();
 
   g.append('g')
       .call(d3.axisLeft(y))
     .append('text')
       .attr('fill', '#000')
       .attr('transform', 'rotate(-90)')
       .attr('y', 6)
       .attr('dy', '0.71em')
       .attr('text-anchor', 'end')
       .text('No Of Cases');
 
   g.append('path')
     .datum(data)
     .attr('fill', 'none')
     .attr('stroke', 'steelblue')
     .attr('stroke-linejoin', 'round')
     .attr('stroke-linecap', 'round')
     .attr('stroke-width', 1.5)
     .attr('d', line);
 });

 
}

function plotScatter(y_sel,month_sel,state_sel) {
    // Get the data
    d3.selectAll("svg#scatter").remove();

    var svg = d3.select("#container-scatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "scatter")

        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("data-monthly.csv").then(function (olddata) {
     
        if(state_sel=="ALL"){
            data = olddata.filter(function (d) {
            
                if (d.month == month_sel) {
    
                    return d;
                }
    
            });
        }
        else{
            data = olddata.filter(function (d) {
                
                if (d.month == month_sel && d.region==state_sel) {
                    console.log(d)
                    return d;
                }
    
            });
    }

        // format the data
        data.forEach(function (d) {
            d.casesper100k = +d.casesper100k;
            d[y_sel] = +d[y_sel];


        });

        // Scale the range of the data
        x.domain([0, d3.max(data, function (d) { return d.casesper100k; })]);
        y.domain(d3.extent(data, function (d) { return d[y_sel]; }));
        dots= svg.selectAll("dot")
        .data(data);
        dots.exit().remove();
        // Add the scatterplot
            dots
            .enter()

            .append("circle")
            .filter(function (d) { return d[y_sel] != '' })
            .attr("r", 5)
            .merge(dots)
            .attr("cx", function (d) { return x(d.casesper100k); })
            .attr("cy", function (d) { return y(d[y_sel]); })
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                div.html(d.county + ", " + d.state)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                get_stats(d);
                plotLine(d.fips)

            });

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height/2 + ")")
            .call(d3.axisBottom(x));
        // X axis label
        svg.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + 50) + ")")
            .style("text-anchor", "middle")
            .text("Covid Cases per 100k");
        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .attr("transform", "translate("+ width/2 + ",0)");

        // text label for the y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Change in Consumer Spending");
    });
}
// Which covariate
var y_sel = $('select').val();
var month_sel=1;
var state_sel="ALL";
plotScatter(y_sel,month_sel,state_sel);

$('select#type-y').on('change', function () {
    y_sel = $('#type-y').val();

    plotScatter(y_sel,month_sel,state_sel);

});
$('select#state').on('change', function () {
    state_sel = $('#state').val();

    plotScatter(y_sel,month_sel,state_sel);

});
$("div#month-sel-buttons>div").click(function () {
    $(".date").removeClass("date-selected");
    $(this).addClass("date-selected");
    month_sel=parseInt($(this).attr("data-value"));
    plotScatter(y_sel,month_sel,state_sel);

});

$("#dragger").draggabilly({
    containment:'#month-sel'
    // options...
  })
