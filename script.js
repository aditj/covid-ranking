var y_sel = $('select').val();
    var month_sel = 0;
    var state_sel = "ALL";
$(document).ready(function(){
    var y_sel = $('select').val();
    var month_sel = 0;
    var state_sel = "ALL";
    $("#month-sel").val(0);
    $("#month-sel").trigger("change");
    plotScatter(y_sel, month_sel, state_sel);
    plotLine(10001)
})
$('select').prop('selectedIndex', 0); // Reset Select
// Setting Dimensions for Scatter Plot
var margin = { top: 20, right: 20, bottom: 120, left: 30 },
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
// Set the range
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
// Tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("visibility", "none");

var yTitles = {
    'spend_all': 'Change in Consumer Spending',
    'emp_combined': 'Change in Employment',
    'revenue_all': 'Change in Small Business Revenue'
}

formatComma = d3.format(",");
var symbol = d3.symbol();

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin


var pop_rankings;
$.ajax({
    dataType: "json",
    url: "pop_rankings.json",
    async: false,
    success: function (data) { pop_rankings = data }
});

var svg = d3.select("#container-scatter").classed("svg-container", true).append("svg")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", `0 0 600 600`)
//class to make it responsive
.classed("svg-content-responsive", true)
    .attr("id", "scatter")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
// Data unavailable
svg.append("text")
                .attr("transform", "translate(" + String(width / 2 - 20) + "," + height / 2 + ")")
                .attr("font-size", "30px")
                .text("Data Unavailable")
                .attr("id","data-unavailable");

// Legend
svg2= d3.select("#container-legend")
.append("svg")
.attr("width", 200 + margin.left + margin.right)
.attr("height", 220 + margin.top + margin.bottom)
.attr("id", "scatter-legend")
//svg2=    d3.select("#container-scatter>svg").append("g")
svg2.append("text").attr("x", 0).attr("y", 95).text("Legend").style("font-size", "20px").attr("alignment-baseline","middle")
svg2.append("circle").attr("cx",10).attr("cy",125).attr("r", 5).attr("class","top-10");
svg2.append("circle").attr("cx",10).attr("cy",155).attr("r", 5).attr("class","bottom-10");

svg2.append("circle").attr("cx",10).attr("cy",175).attr("r", 5).attr("class","noise");
svg2.append("path")
.attr("d",symbol.type(d3.symbolStar))
.attr("class" , 'top-county')
.attr("transform","translate(10,200)");
svg2.append("line")
.attr("x1",0)
.attr("y1", 237)
.attr("x2", 20) 
.attr("y2", 237)
.attr("class","median-lines");


svg2.append("text").attr("x", 30).attr("y", 130).text("5 most populous counties").style("font-size", "14px").attr("alignment-baseline","middle")
svg2.append("text").attr("x", 30).attr("y", 160).text("5 least populous counties").style("font-size", "14px").attr("alignment-baseline","middle")
svg2.append("text").attr("x", 30).attr("y", 180).text("Other Counties").style("font-size", "14px").attr("alignment-baseline","middle")
svg2.append("text").attr("x", 30).attr("y", 200).text("Counties with the best health").style("font-size", "14px").attr("alignment-baseline","middle")
svg2.append("text").attr("id","definition-link").attr("x", 30).attr("y", 215).text("and wealth balance *").style("font-size", "14px").attr("alignment-baseline","middle")
.on("click",function(){
    window.open("https://github.com/aditj/covid-ranking#definitions"); 
})
svg2.append("text").attr("x", 30).attr("y", 240).text("Medians").style("font-size", "14px").attr("alignment-baseline","middle")



// Axes
// Add the X Axis
x_axis = svg.append("g")
    .attr("transform", "translate(0," + Math.abs(height / 2) + ")")
    .call(d3.axisBottom(x));
// X axis label
svg.append("text")
    .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + 50) + ")")
    .style("text-anchor", "middle")
    .text("Covid Cases per 100k")
    .attr("font-size",20);


// Add the Y Axis

y_axis = svg.append("g")
    .call(d3.axisLeft(y))
    .attr("transform", "translate(" + Math.abs((width / 2)) + ",0)");

// text label for the y axis

y_title=svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "20px")
    .style("text-anchor", "middle")
    .attr("font-size",20);
// // Better and Worse 
// svg.append("text")
//     .attr("y",0)
//     .attr("x",0)
//     .attr("dy","1em")
//     .text("BETTER")
//     .style("font-size", "14px");
//     svg.append("text")
//     .attr("y",height)
//     .attr("x",width-40)
//     .attr("dy","1em")
//     .text("WORSE")
//     .style("font-size", "14px");
    
// Median Lines
y_pos=0;
cases_pos=0;
// vertical_median=svg.append("line")
//     .attr("x1", cases_pos*width) 
//     .attr("y1", 0)
//     .attr("x2", cases_pos*width) 
//     .attr("y2", height)
//     .attr("class","median-lines");


// horizontal_median=svg.append("line")
//     .attr("x1", 0) 
//     .attr("y1", height*y_pos)
//     .attr("x2", width) 
//     .attr("y2", height*y_pos)
//     .attr("class","median-lines");



var t = d3.transition()
    .duration(750);


// Which covariate
setTimeout(()=>$("#all-year").click(),1000);


$('select#type-y').on('change', function () {
    y_sel = $('#type-y').val();

    plotScatter(y_sel, month_sel, state_sel);

});
$('select#state').on('change', function () {
    state_sel = $('#state').val();

    plotScatter(y_sel, month_sel, state_sel);

});
$("#month-sel").on('change',function () {
   $(".date").removeClass("date-selected");
   month_sel = parseInt($(this).val());
    $("div.date[data-value='" + month_sel +"']").addClass("date-selected");

    plotScatter(y_sel, month_sel, state_sel);

});

$("#pop-filter").on("change", function () {
    plotScatter(y_sel, month_sel, state_sel);
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
// $("#play-icon").click(function() {
//     $('.date').each(async function(i) {
//         await sleep(800*i++);
//             $(this).click();
            
//      })
//   });

function plotLine(fips) {
    // Template from https://bl.ocks.org/mbostock/3883245
    d3.select("svg#linechart").selectAll("*").remove();


    var svg = d3.select('#linechart'),
        margin = { top: 20, right: 40, bottom: 0, left: 30 },
        width = parseInt(svg.attr("width"))  - margin.left - margin.right,
        height = 130 - margin.top - margin.bottom,
        g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var parseTime = d3.timeParse('%Y-%m-%d');
    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.new_cases); });

    d3.csv('dailydata/' + parseInt(fips) + '.csv').then(function (data) {
        data.forEach(function (d) {
            d.date = parseTime(d.date);
            d.new_cases = +d.new_cases;


        });


        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain(d3.extent(data, function (d) { return d.new_cases; }));

        g.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x).ticks( d3.timeMonth.every(2)))
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
            .text('New Cases per 100k');

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
function return_class(d){
    cl="dots "
    if(d.pop_density > pop_rankings[state_sel]['high']){
        cl+="top-10 ";
    }
    else if(d.pop_density < pop_rankings[state_sel]['low'] ){
        cl+="bottom-10 ";
    }
    else{
        cl+= "noise ";
    }
    if(d.isatop){
        cl+="top-county ";
    }
    return cl;
     
}
function plotScatter(y_sel, month_sel, state_sel) {
    // Get the data



    // ALL YEAR
    filename = (month_sel == 0) ? "data-yearly.csv" : "data-monthly.csv";
    d3.csv(filename).then(function (data) {
        popfilter = $("#pop-filter").val();
        switch(popfilter){
            case "low":
                var data = data.filter(function (d) {
                    if(d.pop_density<1000){
                        return d;
                    }
            });
            break;
            case "med":
                var data = data.filter(function (d) {
                    if((d.pop_density>1000) && (d.pop_density<3000)){
                        return d;
                    }
            });
            break;
            case "high":
                var data = data.filter(function (d) {
                    if(d.pop_density>3000){
                        return d;

                    }

            });
            break;
            case "all":
                break;
                }
        if (state_sel == "ALL") {
            if (month_sel == 0) {
                var data = data.filter(function (d) {
                        return d;
                });
            }
            else {
                data = data.filter(function (d) {

                    if (d.month == month_sel) {

                        return d;
                    }

                });
            }
        }
        else {
            if (month_sel == 0) {
                data = data.filter(function (d) {

                    if (d.region == state_sel) {

                        return d;
                    }

                });
            }
            else {
                data = data.filter(function (d) {

                    if (d.month == month_sel && d.region == state_sel) {
                        return d;
                    }

                });
            }
        }
        data = data.filter(function (d) { return d[y_sel] != '' });

         //format the data
         data.forEach(function (d, i) {

            d.casesper100k = +d.casesper100k;
            d[y_sel] = +100*d[y_sel];

        });
       // Code to rank them.

        var len=data.length
        var caseindices_ = new Array(len);
        for (var i = 0; i < len; ++i) caseindices_[i] = i;
        caseindices_.sort(function (a, b) { return data[a]['casesper100k'] < data[b]['casesper100k'] ? -1 :data[a]['casesper100k'] > data[b]['casesper100k'] ? 1 : 0; });
        var caseindices = new Array(len);
        for (var i = 0; i < len; ++i) caseindices[i] = i;
        caseindices.sort(function (a, b) { return caseindices_[a]< caseindices_[b]? -1 : caseindices_[a]> caseindices_[b] ? 1 : 0; });
        var y_selindices_ = new Array(len);
        for (var i = 0; i < len; ++i) y_selindices_[i] = i;
        y_selindices_.sort(function (a, b) { return data[a][y_sel] < data[b][y_sel] ? -1 :data[a][y_sel] > data[b][y_sel] ? 1 : 0; });
        var y_selindices = new Array(len);
        for (var i = 0; i < len; ++i) y_selindices[i] = i;
        y_selindices.sort(function (a, b) { return y_selindices_[a] < y_selindices_[b] ? -1 :y_selindices_[a] > y_selindices_[b] ? 1 : 0; });

        for (var j=0;j<len;j++){
          data[j]['casesindices']= caseindices[j];
          data[j]["y_selindices"]= y_selindices[j];

        }
        top_counties=[]
        
        if(len>10){
            if( len<100){
                pct=len*0.1;
            }
            else{
                pct=len*0.1;
            }
            
            data
            .filter(function(d){
                return (d.casesindices<pct) && (d.y_selindices>(len-pct))})
                .forEach(function(d){
                    top_counties.push(d.fips);
                
                })
            
        }
        data.forEach(function (d, i) {

            d.isatop=top_counties.includes(d.fips);

        });
       

        // Scale the range of the data
       x.domain([0, d3.max(data, function (d) { return d.casesper100k; })]);
    //    console.log(d3.mean(data, function (d) { return d['casesper100klog']; }))
       // x.domain([(d3.max(data, function (d) { return d['casesper100klog']; })- 2*d3.mean(data, function (d) { return d['casesper100klog']; })),d3.max(data, function (d) { return d['casesper100klog']; })]);
       y.domain(d3.extent(data,function(d){return d[y_sel]})) 
       // y.domain([(d3.max(data, function (d) { return d[y_sel]; })- 2*d3.mean(data, function (d) { return d[y_sel]; })),d3.max(data, function (d) { return d[y_sel]; })]);

        dots = svg.selectAll(".dots").data(data);
        // console.log(dots.exit());
        // Add the scatterplot
        dots
            .enter()
            .append("path")

            .attr("class","dots")
            .merge(dots)
            .transition()
            .attr("d", symbol.type(
                function(d){
                    if (d.isatop){
                        return d3.symbolStar;
                    }
                    else{
                        return d3.symbolCircle;
                    }
                }
            ))
            .attr('transform',function(d){ return "translate("+x(d.casesper100k)+","+y(d[y_sel])+")"; })
            .attr("class", d=>return_class(d));
            
            //  .attr("x", function (d) { return x(d.casesper100k); })
            //.attr("y", function (d) { return y(d[y_sel]); });
        dots.on("mouseover", function (d) {
            div.attr("style", {'display':'block'});
            div.transition()
                .duration(200)
                .style("opacity", 0.9);
            div.html(d.county + ", " + d.state)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
            .on("mouseout",function(d){
                div.attr("style", {'display':'none'});
                div.html("");
            });
            get_stats(d);
            plotLine(d.fips)

        });
        dots.exit().transition().attr("opacity", 0).remove();
        if (data.length == 0) {
            $("#data-unavailable").show();
            return "NO DATA";
        }
        else{
            $("#data-unavailable").hide();
        }

        cases_pos = x(d3.median(data, d => d.casesper100k)) / x(d3.max(data, d => d.casesper100k));
        y_pos = y(d3.median(data, d => d[y_sel])) / y(d3.min(data, d => d[y_sel]));
        // vertical_median.transition()
        //     .attr("x1", cases_pos*width) 
        //     .attr("y1", 0)
        //     .attr("x2", cases_pos*width) 
        //     .attr("y2", height)
        // horizontal_median.transition()
        //     .attr("x1", 0) 
        //     .attr("y1", height*y_pos)
        //     .attr("x2", width) 
        //     .attr("y2", height*y_pos)
        x_axis.transition().call(d3.axisBottom(x))
        .attr("transform", "translate(0,"+(height*y_pos)+" )");
        y_axis.transition().call(d3.axisLeft(y))
        .attr("transform", "translate("+cases_pos*width+", 0)");
        y_title.text(yTitles[y_sel]+' (%)');

        return data;
    })
    
}

function get_stats(d) {
    $("#countyname").html(d.county + " County, " + d.state);
    $("#pop_density").html(String(Math.round(d.pop_density * 10) / 10) + " per sq. mile");
    $("#pop").html(String(formatComma(Math.round(d.pop * 10) / 10)));
    $("#median_income").html(String(formatComma(Math.round(d.median_income * 10) / 10)) + " $");
    $("#median_age").html(String(Math.round(d.median_age * 10) / 10) + " years");
    $("#pct_min").html(String(Math.round(d.pct_min * 10) / 10) + " %");
    $("#over60").html(String(Math.round(d.over60 * 10) / 10) + " %");

}
