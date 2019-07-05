// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
// set the ranges
													
//NOTE: .rangeRounBands is for D3 V3, .scaleBand() is for D3 V4
var x = d3.scaleBand()
.rangeRound([0, width])
.padding(0.1);
// NOTE: scaleLinear() is the option to use for D3 v4 and 5
//scale.linear() is for D3 V3
// set the ranges
var y = d3.scaleLinear()
.range([height, 0]);
											 
// var xAxis = d3.svg.axis()
//     .scale(x)
//      .orient("bottom");

var yAxis = d3.axisLeft();
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("div").append("graphID")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    // get the data
d3.csv("Violation_bar_chart.csv", function(error, data) {
    if (error) throw error;
    // // format the data
    data.forEach(function(d) {
        d.critical_flag_num = +d.critical_flag_num;
    });
												
    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.critical_flag; }));
    y.domain([0, d3.max(data, function(d) { return d.critical_flag_num; })]);
    
// add the y Axis
            //NEEDS TO BE BELOW X.DOMAIN AND Y.DOMAIN TO SHOW THE RIGHT AXIS UNITS
svg.append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(y).ticks(7))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",6)
    .attr("dy", ".71em")
    .style ("text-anchor", "end")
    .text("Frequency");
    // add the x Axis
    svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        
//  svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Frequency");
            
// append the rectangles for the bar chart
svg.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.critical_flag); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.critical_flag_num); })
            .attr("height", function(d) { return height - y(d.critical_flag_num);  })
            .attr("font-size", "34px")
        });
        //   .on('mouseover', tip.show)
        //   .on('mouseout', tip.hide)
    
    //lg:   tip is not a recognized function.  Found this info on stackoverflow.
    // https://stackoverflow.com/questions/48507087/d3-tip-and-npm-typeerror-m-tip-is-not-a-function


    // add the y Axis
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
    })
    svg.call(tip);
        
    function type(d) {
    d.frequency = +d.frequency;
    return d;
}
