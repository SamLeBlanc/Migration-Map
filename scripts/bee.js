
function drawBee(state, direction) {
    beeHeight = 300
    direction = getDirection()

    if (tiles.held.current != ''){
      state = tiles.held.current
    } else {
      state = tiles.hover.current
    }

    let states = [... new Set(data['2020'].map(d => d.stateA))]

    if (tiles.hover.current != "Ocean"){
      D = []
      states.forEach(e => {
        if (state != e) {
          D.push({
            name: e,
            change: getInterStateSum(state, e, getDirection()),
            size: abbrState(e, 'pop')
          })
        }
      })
    } else {
      D = []
      states.forEach(e => {
        D.push({
          name: e,
          change: getSingleStateSum(e, getDirection()),
          size: abbrState(e, 'pop')
        })
      })
    }


    svg2.select(".cells").remove()
    svg2.select(".axis").remove()
    svg2.select(".axis-label").remove()

    scaleSelect = $('#log').is(':checked') ? d3.scaleLog() : d3.scaleLinear();
    bounds = $('#log').is(':checked') ? [500,10000] : [0,2000];
    if (tiles.hover.current == "Ocean") {
      bounds = [0,25000]
    }

    if (getDirection() != 'net'){
      var axisScale = scaleSelect
          .rangeRound([50, width-50])
          .domain([bounds[0]-0.05*(d3.max(D, d => d.change)), bounds[1]+d3.max(D, d => d.change) ]);
    } else {
      var axisScale = scaleSelect
          .rangeRound([50, width-50])
          .domain([1.05*(d3.min(D, d => d.change)),1.05*(d3.max(D, d => d.change))]);
    }

    var sizeScale = d3.scaleSqrt()
        .range([7, 30]);

    sizeScale.domain(d3.extent(D, d => d.size));

    var simulation = d3.forceSimulation(D)
        .force("x", d3.forceX(d => axisScale(d.change)).strength(1))
        .force("y", d3.forceY(beeHeight / 2))
        .force("collide", d3.forceCollide((d, i) => sizeScale(d.size) + 2))
        .stop();

    for (var i = 0; i < 250; ++i) simulation.tick();

    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (beeHeight) + ")")
        .call(d3.axisBottom(axisScale).ticks(12))
        ;

    let ax_title = ''
    if(getDirection() == 'in-mover') ax_title = 'In-movers Count'
    if(getDirection() == 'out-mover') ax_title = 'Out-movers Count'
    if(getDirection() == 'net') ax_title = 'Net-movers Count'


    svg2.append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", width/2)
      .attr("y", beeHeight + 50)
      .text(ax_title);

    // JOIN
    var cell = svg2.append("g")
        .attr("class", "cells")
        .selectAll("g").data(d3.voronoi()
          .extent([[0, 0], [width, beeHeight]])
          .x(d => d.x)
          .y(d => d.y)
          .polygons(D)).enter().append("g")

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
        .on("mouseover", function(d, i){
          d3.select(this).attr("fill", "red")
        })
        .on("mouseout", function(d,i){
          d3.select(this).attr("fill", d => getBubbleFill(d))
        });

    cell.append("text")
        .text(d => abbrState(d.data.name, 'abbr'))
        .attr("x", d => d.data.x + sizeScale(d.data.size)*0.05)
        .attr("y", d => 20 + d.data.y + sizeScale(d.data.size)*0.33 )
        .attr("text-anchor", "middle")
        .attr("fill", d => {
          return (tiles.hover.current != "Ocean" || getDirection() == 'net') ? "black" : "white";
        })
        .attr("font-size", d => 1.1*sizeScale(d.data.size))
        .attr("pointer-events", "none")
  }

  const getBubbleStroke = d => {
    if (tiles.held.current != "" && tiles.hover.current == d.data.name) return $('#color-3').val()
    else return "black"
  }

  const getBubbleStrokeWidth = d => {
    if (tiles.held.current != "" && tiles.hover.current == d.data.name) return "5"
    else return "2"
  }

  const getBubbleFill = d => {
    if (tiles.held.current != "" && tiles.hover.current == d.data.name) return fillBubbleSingle(d)
    if (tiles.held.current == d.data.name) return $('#color-3').val()
    if (tiles.hover.current == d.data.name) return $('#color-3').val()
    if (tiles.hover.current == "Ocean" && !tiles.held.current) return fillNationalBubbleSum(d)
    else return fillBubbleSingle(d)
  }

  const fillBubbleSingle = d => {
    let stateA = tiles.held.current ? tiles.held.current : tiles.hover.current
    let stateB = d.data.name
    let interStateSum = getInterStateSum(stateA, stateB, getDirection())
    if ($('#count-select').val() == 'percent-a') {
      interStateSum = 100*interStateSum / getInterStateData(stateA, stateB, getDirection()).map(e => +e.A_pop)
    } else if ($('#count-select').val() == 'percent-b') {
      interStateSum = 100*interStateSum / getInterStateData(stateA, stateB, getDirection()).map(e => +e.B_pop)
    }
    return getColor(interStateSum)
  }

  const fillNationalBubbleSum = d => getColor(getSingleStateSum(d.data.name, getDirection()))
