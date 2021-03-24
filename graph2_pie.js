let svg_pie = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${graph_2_width/2-130}, ${graph_2_height/2+150})`);

let radius = 200;

let pro_countdata;
let arc; 
let piedata; 

let label = svg_pie.append("g");


 

function graph2_update(cur_genre) {
//Create data set for marker
// Filter data by genre
//d3.selectAll("text").remove();
svg_pie.selectAll("text").remove();

let genre_data;
genre_data = data.filter(function(a) {
  return cur_genre==a.Genre;

  });

 //console.log(genre_data)
//calculate how many publisher for each
let countdata = d3.nest()
  .key(function(d) { return d.Publisher; })
  .rollup(function(v) { return d3.sum(v, function(d) {return parseFloat(d.Global_Sales);})})
  .entries(genre_data)
  .sort(function(a, b) {return parseFloat(b.value)-parseFloat(a.value)});

  console.log(countdata)

let cutoff = 5;
//store the data for percentage cal
pro_countdata  = countdata.slice(0,cutoff);

/*
let other_countdata  = countdata.slice(cutoff,countdata.length)

let other_count = 0;
for(i=0;i<other_countdata.length;i++){
  other_count = other_count+other_countdata[i].value; 
}
*/
//pro_countdata.push({key: "Others", value:other_count });
//console.log(pro_countdata)



// set the color scale
let piecolor = d3.scaleOrdinal(d3.schemeCategory10);


var pie = d3.pie().value(function(d) {return d.value; }).sort(null);

arc = d3.arc().outerRadius(radius).innerRadius(0);

piedata = pie(pro_countdata);

//console.log(path)
let u = svg_pie.selectAll("path").data(piedata);

    u.enter()
    .append("path")
    .merge(u)
    .transition()
    .duration(1000)
    .attr("d", arc)
    .attr('fill', function(d){ return(piecolor(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.5)   
// Chart title
//title_map.text(`The most popular genre per region`);

// Now add the annotation. Use the centroid method to get the best coordinates
let label_out = label.selectAll("text").data(piedata);

label_out.enter()
  .append('text')
  .merge(label_out)
  .transition()
  .duration(1000)
  .text(function(d){ return d.data.key})
  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 12)

u.exit().remove();
label_out.exit().remove();

// Add chart title
let pietitle = svg_pie.append("text")
    .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2-350}, ${-270})`)
    .style("text-anchor", "middle")
    .style("font-size", 15);
pietitle.text(`Top 5 publisher in the Genre: ${cur_genre}`);  


}


function calPercent(){
  //console.log(pro_countdata)
  
  
  //svg_pie.selectAll("text").remove();
  
  // total value:
  let total_count = 0;
  for(i=0;i<pro_countdata.length;i++){
    total_count = total_count+pro_countdata[i].value; 
  }
  
  // cal percentage:
  for(i=0;i<pro_countdata.length;i++){
    pro_countdata[i].value =((pro_countdata[i].value/ total_count)*100).toFixed(2);
  
  }
  
  
  let percent_text = svg_pie.selectAll("thistext").data(piedata);
  
  //console.log(pro_countdata)
  
  percent_text.enter()
    .append("text")
    .merge(percent_text)
    .transition()
    .duration(1000)
    .text(function(d){ return d.data.value+"%"})
    //.attr("transform", function(d) { return "translate(" + arc.centroid(d)+10 + ")";  })
    .attr("transform", function(d) {let cen = arc.centroid(d),
        x = cen[0],y = cen[1],h = Math.sqrt(x*x + y*y);
      return "translate(" + (x/h * (radius+20)) + ',' +(y/h * (radius+20)) +  ")"; 
    })
    .style("text-anchor", "middle")
    .style("font-size", 15)
  
  
    percent_text.exit().remove();
  
  
  }
  