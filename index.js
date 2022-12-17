let data = {};
let links = [];
let lonks;
let legend;

// Initial tile settings
let tiles = {
  'hover' : {
    'previous' : '',
    'current' : 'Ocean' },
  'held' :  {
    'previous' : '',
    'current' : ''}
}

// Load data from file
const loadData = () => {
  Promise.all([
    d3.json("data/states.geojson"),
    d3.csv("data/state_migration.csv")
  ]).then(
    function (init) {
      data = { 'countries':init[0], '2020':init[1]}
      drawWater()
      draw()
    })
}

// Redraw everything!
function draw(){
  land.selectAll("*").remove();
  updateTitle()
  drawAllStates()
  lonks = drawLinks()
  drawBeeswarm()
  drawLegend()
}
