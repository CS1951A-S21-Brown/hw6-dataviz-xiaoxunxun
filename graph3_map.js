// Set up SVG object with width, height and margin

let graph_width = MAX_WIDTH / 2, graph_height = 400;

let svg_mapout = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_width)
    .attr("height", graph_height)
    .append("g")
    .attr("transform", `translate(${-50}, ${margin.top-30})`);

// Map and projection
let projection = d3.geoNaturalEarth()
    .center([0, 0]) //center at [0,0]            
    .scale(130)  // msap scale                  

function CreateMap() {


//Create data set for marker

//North America
let NATotal = d3.nest()
  .key(function(d) { return d.Genre; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.NA_Sales; });})
  .entries(data)
  .sort(function(a, b) {return parseFloat(b.value)-parseFloat(a.value)})
//  .slice(0,1);

let NA_best_genre = NATotal[0].key;
let NA_best_sell = NATotal[0].value;

//EU
let EUTotal = d3.nest()
  .key(function(d) { return d.Genre; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.EU_Sales; });})
  .entries(data)
  .sort(function(a, b) {return parseFloat(b.value)-parseFloat(a.value)})
//  .slice(0,1);

let EU_best_genre = EUTotal[0].key;
let EU_best_sell = EUTotal[0].value;


//JP
let JPTotal = d3.nest()
  .key(function(d) { return d.Genre; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.JP_Sales; });})
  .entries(data)
  .sort(function(a, b) {return parseFloat(b.value)-parseFloat(a.value)})
//  .slice(0,1);

let JP_best_genre = JPTotal[0].key;
let JP_best_sell = JPTotal[0].value;

//Others
let OtherTotal = d3.nest()
  .key(function(d) { return d.Genre; })
  .rollup(function(v) { return d3.sum(v, function(d) { return d.Other_Sales; });})
  .entries(data)
  .sort(function(a, b) {return parseFloat(b.value)-parseFloat(a.value)})
//  .slice(0,1);

let Other_best_genre = OtherTotal[0].key;
let Other_best_sell = OtherTotal[0].value;

//console.log(NA_best_genre)
// Create geology data for NA, EU, Japan, and others:
let markers = [
    {long: -101.25, lat: 40.87, name: "North America", genre: NA_best_genre, sales: NA_best_sell}, // North America
    {long: 2.349, lat: 48.864, name: "Europe", genre: EU_best_genre, sales: EU_best_sell}, // European 
    {long: 139.84, lat: 35.65, name: "Japan",genre: JP_best_genre, sales: JP_best_sell}, //Japan
    {long: 75.62, lat: -22.51, name: "Other regions", genre: Other_best_genre, sales: Other_best_sell}, // Others
  ];


//draw the world map

let url = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

d3.json(url).then(function(data){

    svg_mapout.selectAll("path")
    .data(data.features)
    .enter().append("path")
    .style("fill", "#81c2c3")
    .attr("d", d3.geoPath().projection(projection))
    .style("stroke", "white");

// create a tooltip
let Tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("text-align", "center")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "10px")

// Three function that change the tooltip when user hover / move / leave a cell
let mouseover = function(d) {
    Tooltip.style("opacity", 1)
  }

let mousemove = function(d) {
      let html = d.name + "<br>" + "Genre: " + d.genre + "<br>"+ "Total Sales: " + d.sales.toFixed(2) + "M"+ "<br>";
      Tooltip.html(html)
      .style("left", `${(d3.event.pageX) + 10}px`)
      .style("top", `${(d3.event.pageY) - 80}px`)
      .style("box-shadow", `2px 2px 10px black`)
      .transition()
      .duration(200)
      .style("opacity", 0.9)
  }

let  mouseout = function(d) {
    Tooltip
    .transition()
    .duration(200)
    .style("opacity", 0)
  }


// Add chart title
let title_map = svg_mapout.append("text")
    .attr("transform", `translate(${(graph_width / 2+50)}, ${40})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);  

// Add circles:
svg_mapout.selectAll("circles")
.data(markers)
.enter()
.append("circle")
.attr("cx", function(d){return projection([d.long, d.lat])[0] })
.attr("cy", function(d){return projection([d.long, d.lat])[1] })
.attr("r", 15)
.attr("class", "circle")
.style("fill", "black")
.attr("stroke", "#69b3a2")
.attr("stroke-width", 3)
.attr("fill-opacity", 0.2)
.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseout", mouseout)
svg_mapout.exit().remove();

// Chart title
title_map.text(`The most popular game genre in different regions`);

});

}


