let data = {};
let links = [];
let lonks;
let legend;

let tiles = {
  'hover' : {
    'previous' : '',
    'current' : 'Ocean' },
  'held' :  {
    'previous' : '',
    'current' : ''}
}

const loadData = () => {
  Promise.all([
    d3.json("data/countries10.geojson"),
    d3.csv("data/state_migration.csv")
  ]).then(
    function (init) {
      data = { 'countries':init[0], '2020':init[1]}
      drawWater()
      draw()
    })
}

function draw(){
  land.selectAll("*").remove();
  updateTitle()
  drawAllStates()
  lonks = drawLinks()
  drawBee()
  drawLegend()
}
