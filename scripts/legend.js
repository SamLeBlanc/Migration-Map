// Draw the map legend
const drawLegend = () => {

  // Numbers to display in legend
  let keys = (getDirection() != 'net') ? [0,5e2,1e3,5e3,1e4,5e4,1e5,5e5] : [-5e5,-1e5,-5e4,-1e4,-5e3,-1e3,-5e2,0,5e2,1e3,5e3,1e4,5e4,1e5,5e5];

  // Remove the legend if it exists
  d3.select("#legendy").remove()

  let legendTitle = () => {
    if (getDirection() == 'net') return "Net-movers"
    if (getDirection() == 'in-mover') return "In-movers"
    if (getDirection() == 'out-mover') return "Out-movers"
  }

  // Create a new group for the legend elements
  const legend = d3.select("#wrapper")
  .append("svg")
  .attr("id","legendy")
  .attr("width", $('#wrapper').css('width'))
  .attr("height", $('#wrapper').css('height'))

  // Legend title
  legend.append("g")
  .append("text")
	.text(legendTitle)
	.attr("x", window.innerWidth - 210)
	.attr("y", 130)
  .style("font-size","26px")

  // Legend circles
  legend.append("g")
    .selectAll("legend-dots")
    .data(keys.reverse())
    .enter()
    .append("circle")
      .attr("cx", window.innerWidth - 200)
      .attr("cy", (d,i) => 158 + i*24) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 16)
  		.attr("stroke","black")
  		.attr("stroke-width","3")
      .style("fill", function(d){ return getColor(d)})

  // Legend labels
  legend.append("g")
    .selectAll("legend-labels")
    .data(keys)
    .enter()
    .append("text")
      .attr("class","legend-label")
      .attr("x", window.innerWidth - 175)
      .attr("y", (d,i) => 164 + i*24.3) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("text-anchor", "left")
      .style("fill", d => getColor(d))
      .text(d => {
        if (d==500000) return `${d.toLocaleString("en-US")}+`
        if (d==-500000) return `${d.toLocaleString("en-US")}-`
        return d.toLocaleString("en-US")
      })
  }
