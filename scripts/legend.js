// Draw the map legend
const drawLegend = () => {
  // Keys to use in import and export maps
  let keys = [0,500,1000,5000,10000,50000,100000,500000];


  // const colors = ["#FAFAE1","#FFFFD6", "#E6F598", "#ABDDA4", "#66C2A5", "#3288BD", "#5E4FA2","#563B7A"];
  // const colors = ["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"];

  // Keys to use in net export maps
  if (getDirection() == 'net') {
    keys = [-500000,-100000,-50000,-10000,-5000,-1000,-500,0,500,1000,5000,10000,50000,100000,500000];
  }

  // Remove the legend if it exists
  try {
    d3.select("#legendy").remove()
  } catch {}

  // Create a new group for the legend elements
  const legend = d3.select("#wrapper")
  .append("svg")
  .attr("id","legendy")
  .attr("width", $('#wrapper').css('width'))
  .attr("height", $('#wrapper').css('height'))

  // Set number format for legend
  const format = d3.format("0.1s");

  let x_pos = window.innerWidth - 200

  // Create the legend dots

  legend.append("g")
    .selectAll("mydots")
    .data(keys.reverse())
    .enter()
    .append("circle")
      .attr("cx", x_pos)
      .attr("cy", function(d,i){ return 158 + i*24}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 16)
  		.attr("stroke","black")
  		.attr("stroke-width","3")
      .style("fill", function(d){ return getColor(d)})

  // Add the legend labels
  legend.append("g")
    .selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
      .attr("class","legend-label")
      .attr("x", x_pos+25)
      .attr("y", function(d,i){ return 170 + i*24}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return getColor(d)})
      .text(function(d){
        if (d==500000) return `${d.toLocaleString("en-US")}+`
        if (d==-500000) return `${d.toLocaleString("en-US")}-`
        return d.toLocaleString("en-US")
      })
      .attr("text-anchor", "left")
  		.style("font-weight","bold")
      .style("alignment-baseline", "middle")
  }
