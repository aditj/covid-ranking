// Setting Dimensions
var margin={top:20,right:20,bottom:30,left:50},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
// parse date/time
var parseTime=d3.timeParse("%d-%b-%y");
// Set the range
var x=d3.scaleLog().range([0,width]);
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
    s+="</span></li><li>Percent Hispanics <span id='#pop-hispanics'>";
    s+="</span> </li><li>Percent Population over 60 <span id='#pop-over60'>";
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
        d.cases = +d.cases;
        d.spend_all=+d.spend_all
    });

  
    // Scale the range of the data
    x.domain([40,d3.max(data, function(d) { return d.cases; })]);
    y.domain(d3.extent(data,function(d) { return d.spend_all; }));
    console.log(d3.min(data,function(d) { return d.spend_all; }))
           
    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.cases); })
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
  
    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
  
  });