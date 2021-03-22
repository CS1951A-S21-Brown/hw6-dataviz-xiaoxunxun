// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};
const NUM_EXAMPLES = 10;

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let cur_year = 2020;

let attr_input = document.getElementById("attrInput");

// Load dataset from video_games.csv
d3.csv("./data/video_games.csv").then(function(d) {
    data = d;
    //default value
    TotalData();
    //console.log(data)
    //updateDashboard();
    CreateMap();
    graph2_update("Action");
});


function setAttr() {
    cur_year = attr_input.value;
    updateDashboard();
}

 function updateDashboard() {
    updateData(cur_year);
}
