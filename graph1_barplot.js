// Set up SVG object with width, height and margin
let svg_barplot = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create a linear scale for the x axis (Total sales)
let x_bar = d3.scaleLinear()
    .range([40, graph_1_width - margin.left - margin.right-60]);

// Create a scale band for the y axis (Name of the video games)
let y_bar = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1); 


let countRef = svg_barplot.append("g");

// Set up reference to y axis label to update text in setData

let y_axis_label = svg_barplot.append("g").attr("transform", `translate(40, 0)`);

// Add x-axis label
svg_barplot.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${(graph_1_height - margin.top - margin.bottom) + 20})`)
    .style("text-anchor", "middle")
    .style("font-size", 12)
    .text("Total sales (in millions)");

// Add y-axis label
let y_axis_text = svg_barplot.append("text")
    .attr("transform", `translate(-0, ${(graph_1_height - margin.top - margin.bottom)/2-90})`)
    .style("text-anchor", "middle")
    .style("font-size", 12)
    .text("Games");

// Add chart title
let title = svg_barplot.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, -20)`)
    .style("text-anchor", "middle")
    .style("font-size", 15)

// Define color scale
let color = d3.scaleOrdinal()
    .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_EXAMPLES));

  
 function TotalData() {

    let process_data = cleanData(data, function(a, b) {return parseFloat(b.Global_Sales)-parseFloat(a.Global_Sales)}, NUM_EXAMPLES);
    
    x_bar.domain([0, d3.max(process_data, function(d) { return parseFloat(d.Global_Sales); })]);
    // Update the y axis domains with the desired attribute
    y_bar.domain(process_data.map(function(d) { return d.Name }));
    color.domain(process_data.map(function(d) { return d.Name }));
    // Render y-axis label
    y_axis_label.call(d3.axisLeft(y_bar).tickSize(0).tickPadding(2));

    let bars = svg_barplot.selectAll("rect").data(process_data);

    // Render the bar elements on the DOM
    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return color(d.Name) })
        .attr("x", x_bar(0))
        .attr("y", function(d) { return y_bar(d.Name); })
        .attr("width", function(d) { return x_bar(d.Global_Sales); })
        .attr("height",  y_bar.bandwidth())


    let counts = countRef.selectAll("text").data(process_data);
        // Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .attr("x", function(d) { return x_bar(d.Global_Sales) + 45; })
            .attr("y", function(d) { return y_bar(d.Name) + 12; })
            .style("text-anchor", "start")
            .text(function(d) {return d.Global_Sales;});
        
        min_year = d3.min(data, function(d) { return d.Year; })
        max_year = d3.max(data, function(d) { if (d.Year!="N/A") return d.Year;})
        title.text(`Top 10 best seller video games in from ${min_year} to ${max_year}`)
        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();
 }    



    
 function updateData(year) {

    // Filter data by year
    let filteredData = data.filter(function(a) {
        return year==a.Year;

    });



    //Group the same name due to different publisher
    let newfilteredData = d3.nest()
    .key(function(d) { return d.Name; })
    .rollup(function(v) { return d3.sum(v, function(d) {return parseFloat(d.Global_Sales);})})
    .entries(filteredData)
 
    //console.log( newfilteredData )

    process_data = cleanData(newfilteredData, function(a, b) {return parseFloat(b.value)-parseFloat(a.value)}, NUM_EXAMPLES);

    console.log( process_data)

    // Update the x axis domain with the max sales of the provided data
    x_bar.domain([0, d3.max(process_data, function(d) { return parseFloat(d.value); })]);


    //console.log( process_data)
    //console.log( d3.max(process_data, function(d) { return parseFloat(d.Global_Sales);}))
    // Update the y axis domains with the desired attribute
    y_bar.domain(process_data.map(function(d) { return d.key }));
    
    color.domain(process_data.map(function(d) { return d.key }));

    // Render y-axis label
    y_axis_label.call(d3.axisLeft(y_bar).tickSize(0).tickPadding(10)).attr("transform", `translate(40, 0)`);
    let bars = svg_barplot.selectAll("rect").data(process_data);

    // Render the bar elements on the DOM
    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr("fill", function(d) { return color(d.key) })
        .attr("x", x_bar(0))
        .attr("y", function(d) { return y_bar(d.key); })
        .attr("width", function(d) { return x_bar(d.value); })
        .attr("height",  y_bar.bandwidth())

/*
        In lieu of x-axis labels, display the count of the artist next to its bar on the
        bar plot.
     */
    let counts = countRef.selectAll("text").data(process_data);
        // Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d) { return x_bar(d.value) + 45; })
            .attr("y", function(d) { return y_bar(d.key) + 12; })
            .style("text-anchor", "start")
            .text(function(d) {return d.value.toFixed(2);});
        
        title.text(`Top 10 best seller video games in ${year}`)
        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();


}

function cleanData(data, comparator, numExamples) {
    data.sort(comparator);
    return data.slice(0,numExamples)
    }