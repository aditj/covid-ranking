// Setting Dimensions
var margin={top:20,right:20,bottom:70,left:50},
width = 960 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;
// parse date/time
var parseTime=d3.timeParse("%d-%b-%y");
// Set the range
var x=d3.scaleLinear().range([0,width]);
var y=d3.scaleLinear().range([height,0]);
// Tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
function get_stats(d){
    s=" <h1>County Stats</h1><ul><li>Population Density <span id='#pop-density'>";
    s+=String(d.pop_density);
    s+="</span> </li> <li>Median Income <span id='#median-income'>";
    s+=String(d.median_income);
    s+="</span></li><li>Median Age <span id='#median-age'>";
    s+=String(d.median_age);
    s+="</span></li><li>Percent African Americans <span id='#pct-black'>";
    s+=String(d.afr);
    s+="</span></li><li>Percent Hispanics <span id='#pop-hispanics'>";
    s+=String(d.hisp);
    s+="</span> </li><li>Percent Population over 55 <span id='#pop-over60'>";
    s+=String(d.over65);
    s+="</span> </li></ul>";
    return s;
}
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#container-scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id","scatter")
    
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// Get the data
d3.csv("data.csv").then(function(data) {

    // format the data
    data.forEach(function(d) {
        d.casesper100k = +d.casesper100k;
        d.spend_all=+d.spend_all
    });

  
    // Scale the range of the data
    x.domain([0,d3.max(data, function(d) { return d.casesper100k; })]);
    y.domain(d3.extent(data,function(d) { return d.spend_all; }));
           
    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.casesper100k); })
        .attr("cy", function(d) { return y(d.spend_all); })
        .on("mouseover", function(d) {
            div.transition()
            .duration(200)
            .style("opacity",0.9);
            div.html(d.county+", "+d.state)
            .style("left", (d3.event.pageX) + "px")             
            .style("top", (d3.event.pageY - 28) + "px");
            d3.select("#county-info").html(
                get_stats(d)
            );

        });
  
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    // X axis label
    svg.append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + 50) + ")")
        .style("text-anchor", "middle")
        .text("Covid Cases per 100k");
    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Change in Consumer Spending");      
  });