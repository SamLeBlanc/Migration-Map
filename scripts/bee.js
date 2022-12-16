const drawBeeswarm = () => {

    let beeswarmHeight = 300

    deleteBeeswarmChart()

    beeswarmData = getBeeswarmData()

    var axisScale = d3.scaleLinear()
        .rangeRound([50, width-50])
        .domain(getAxisDomain(beeswarmData));

    var sizeScale = d3.scaleSqrt()
        .range([7, 30])
        .domain(d3.extent(beeswarmData, d => d.size));

    var simulation = d3.forceSimulation(beeswarmData)
        .force("x", d3.forceX(d => axisScale(d.change)).strength(1))
        .force("y", d3.forceY(beeswarmHeight / 2))
        .force("collide", d3.forceCollide((d, i) => sizeScale(d.size) + 2))
        .stop();

    for (var i = 0; i < 250; ++i) simulation.tick();

    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (beeswarmHeight) + ")")
        .call(d3.axisBottom(axisScale).ticks(12));

    svg2.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", beeswarmHeight + 50)
      .text(getAxisTitleName());

    // JOIN
    var cell = svg2.append("g")
        .attr("class", "cells")
        .selectAll("g").data(d3.voronoi()
        .extent([[0, 0], [width, beeswarmHeight]])
        .x(d => d.x)
        .y(d => d.y)
        .polygons(beeswarmData)).enter().append("g")

    // voronoi
    var voronoi = cell.append("path")
        .attr("d", d => ("M" + d.join("L") + "Z"));

    // circle
    cell.append("circle")
        .attr("r", d => sizeScale(d.data.size))
        .attr("cx", d => d.data.x)
        .attr("cy", d => 20 + d.data.y)
        .attr("fill", (d, i) => getBubbleFill(d))
        .attr("stroke", (d, i) => getBubbleStroke(d))
        .attr("stroke-width", (d, i) => getBubbleStrokeWidth(d))

    cell.append("text")
        .text(d => stateAbbrPopulation(d.data.name, 'abbr'))
        .attr("x", d => d.data.x + sizeScale(d.data.size)*0.05)
        .attr("y", d => 20 + d.data.y + sizeScale(d.data.size)*0.33 )
        .attr("text-anchor", "middle")
        .attr("fill", d => getBubbleTextColor(d))
        .attr("font-size", d => 1.1*sizeScale(d.data.size))
        .attr("pointer-events", "none")
  }

const getBeeswarmData = () => {

  let beeswarmData = []
  let state_names = [... new Set(data['2020'].map(d => d.stateA))]
  let focus_state = tiles.held.current != '' ? tiles.held.current : tiles.hover.current
  let interstate = (tiles.hover.current != "Ocean" || (tiles.held.current != '' && tiles.hover.current == 'Ocean'))
  let change = e => interstate ? getInterStateSum(focus_state, e, getDirection()) : getSingleStateSum(e, getDirection())

  state_names.forEach(e => {
    if (interstate && focus_state == e) return
    beeswarmData.push({
      name: e,
      change: change(e),
      size: stateAbbrPopulation(e, 'pop')
    })
  })

  return beeswarmData
}

  const deleteBeeswarmChart = () => {
    svg2.select(".cells").remove()
    svg2.select(".axis").remove()
    svg2.select(".axis-label").remove()
  }

  const getAxisDomain = beeswarmData => {
    let bounds = (!tiles.held.current && tiles.hover.current == "Ocean") ? [0,25000] : [0,2000];
    if (getDirection() != 'net'){
      domain = [bounds[0] - (d3.max(beeswarmData, d => d.change))*0.05,
                bounds[1] + d3.max(beeswarmData, d => d.change)]
    } else {
      domain = [1.05*(d3.min(beeswarmData, d => d.change)),
                1.05*(d3.max(beeswarmData, d => d.change))]
    }
    return domain
  }

  const getAxisTitleName = () => {
    if(getDirection() == 'in-mover') return 'In-movers Count'
    if(getDirection() == 'out-mover') return 'Out-movers Count'
    if(getDirection() == 'net') return 'Net-movers Count'
    return "?????"
  }

  const getBubbleTextColor = d => (tiles.hover.current != "Ocean" || getDirection() == 'net' || tiles.held.current) ? "black" : "white"

  const getBubbleStroke = d => (tiles.held.current != "" && tiles.hover.current == d.data.name) ? $('#color-3').val() : "black"

  const getBubbleStrokeWidth = d => (tiles.held.current != "" && tiles.hover.current == d.data.name) ? 5 : 2

  const fillNationalBubbleSum = d => getColor(getSingleStateSum(d.data.name, getDirection()))

  const getBubbleFill = d => {
    if (tiles.held.current != "" && tiles.hover.current == d.data.name) return fillBubbleSingle(d)
    else if (tiles.held.current == d.data.name || tiles.hover.current == d.data.name) return $('#color-3').val()
    else if (tiles.hover.current == "Ocean" && !tiles.held.current) return fillNationalBubbleSum(d)
    else return fillBubbleSingle(d)
  }

  const fillBubbleSingle = d => {
    let stateA = tiles.held.current ? tiles.held.current : tiles.hover.current
    let stateB = d.data.name
    let interStateSum = getInterStateSum(stateA, stateB, getDirection())
    return getColor(interStateSum)
  }
