// Scale number ending based on the size in million, billion, trillion
// Goes with scaleNum()
const scaleMBT = val => {
  // note: values are all in millions as default
  if (Math.abs(val) > 1000000) return "trillion"
  return (Math.abs(val) > 1000) ? "billion" : "million"
}

// Scale the number to fit with the million, billion, trillions ending
// Goes with scaleMBT()
const scaleNum = val => {
  if (Math.abs(val) > 1000000) val = val/1000000
  if (Math.abs(val) > 1000) val = val/1000
  if (Math.abs(val) < 10) return val.toFixed(1)
  return Math.round(val)
}

const updateTitle = (i=null) => {
  if (tiles.hover.current == "Ocean" && !tiles.held.current){
    let titleDirection = $('#direction-select').find(":selected").text()
    $('.title').html(`<span id="title-state" style="color: ${$('#color-3').val()}">National</span> <span id="title-direction">${titleDirection.slice(0,-4)}&nbsp</span><div class="tooltip">
      <img src="assets/i-icon.png" class="icon-i">
      <span class="tooltiptext">Tooltip text</span>
    </div>`)
  } else {
    name = i == null ? tiles.held.current :  i.properties.NAME
    let stateA = tiles.held.current ? tiles.held.current : name;
    let direction = getDirection()
    if (direction == 'in-mover') titleDirection = 'In-movers to'
    if (direction == 'out-mover') titleDirection = 'Out-movers from'
    if (direction == 'net') titleDirection    = 'Net Movers to/from'
    $('.title').html(`<span id="title-direction">${titleDirection}</span> <span id="title-state" style="color: ${$('#color-3').val()}">${stateA}&nbsp</span><div class="tooltip">
      <img src="assets/i-icon.png" class="icon-i">
      <span class="tooltiptext">Tooltip text</span>
    </div>`)
  }
}

const updateSubtitle1 = i => {
  $('#info-1').css('color','grey')
  let string = "Hover over a state to learn more..."
  document.getElementById("info-1").textContent = string

  if (tiles.hover.current != "Ocean" || tiles.held.current != ''){
    let stateA = tiles.held.current ? tiles.held.current : i.properties.NAME;
    let countrySum = getSingleStateSum(stateA, getDirection())
    let direc = getDirection() == 'net' ? 'net in-movers' : getDirection()
    string = `In 2019, ${stateA} had ~${(Math.round(countrySum/100)*100).toLocaleString("en-US")} ${direc}s.`


    if (getDirection() == 'net') {
      let direc = getDirection() == 'net' ? 'net in-movers' : getDirection()
      let sign = (Math.round(countrySum/100)*100) > 0 ? "gain" : "loss";
      string = `In 2019, ${stateA} had a net movers ${sign} of ~${Math.abs(Math.round(countrySum/100)*100).toLocaleString("en-US")}.`
    }
    document.getElementById("info-1").textContent = string
    $('#info-1').css('color','black')
  }
}

const getSingleStateData = (stateA, direction) => {
  return data['2020'].filter( e => e.stateA == stateA && e.Direction == direction )
}

const getSingleStateSum = (stateA, direction) => {
  if (direction != 'net') {
    return d3.sum(getSingleStateData(stateA, direction).map(e => +e.Value))
  } else {
    return (
      d3.sum(getSingleStateData(stateA, 'in-mover').map(e => +e.Value)) -
      d3.sum(getSingleStateData(stateA, 'out-mover').map(e => +e.Value))
    )
  }
}

const getInterStateData = (stateA, stateB, direction) => {
  return data['2020'].filter( e => e.stateA == stateA && e.stateB == stateB && e.Direction == direction )
}

const getInterStateSum = (stateA, stateB, direction) => {
  if (direction != 'net') {
    return d3.sum(getInterStateData(stateA, stateB, direction).map(e => +e.Value))
  } else {
    return (
      d3.sum(getInterStateData(stateA, stateB, 'in-mover').map(e => +e.Value)) -
      d3.sum(getInterStateData(stateA, stateB, 'out-mover').map(e => +e.Value))
    )
  }}

const getColor = x => {
  if (getDirection() != 'net') return colorImportExport(x)
  else return colorNetExports(x)
}

const colorImportExport = x => {
  if (Math.abs(x) < 0.1) return "#ddd"

  n = 9

  const breaks = [0,100,500,1000,5000,10000,50000,100000,500000];

  out_colors = [...Array(n).keys()].map(d => d3.interpolateRgb("lightgrey", $('#color-1').val() )((  Math.min(1,d/(n-1))  ) ))
  in_colors = [...Array(n).keys()].map(d => d3.interpolateRgb("lightgrey", $('#color-2').val() )((  Math.min(1,d/(n-1))  ) ))

  // out_colors = [...Array(n).keys()].map(d => d3[`interpolate${$('#out-color-select').val()}`] (d/(n-1)))
  // in_colors = [...Array(n).keys()].map(d => d3[`interpolate${$('#in-color-select').val()}`] (d/(n-1)))

  const colors = getDirection() == 'in-mover' ? in_colors : out_colors;

  let count = 0;
  breaks.forEach(n => { if(n<x) count++ });
  const a = breaks[count-1],
        b = breaks[count];
  const colorA = colors[count-1],
        colorB = colors[count];
  const t = (x-a)/(b-a)

  return d3.interpolateLab(colorA, colorB)(t)
}

const colorNetExports = x => {
  if (x == 0) return "#ddd"
  n = 9
  const out_colors = [...Array(n).keys()].reverse().map(d => d3.interpolateRgb("lightgrey", $('#color-1').val() )(d/(n-1)))
  const in_colors = [...Array(n).keys()].map(d => d3.interpolateRgb("lightgrey", $('#color-2').val() )(d/(n-1)))
  const breaks = [-1000000,-500000,-100000,-50000,-10000,-5000,-1000,-500,-100,0,100,500,1000,5000,10000,50000,100000,500000,1000000];
  const colors = out_colors.concat(['#fff'], in_colors)
  let count = 0;
  breaks.forEach(n => { if(n<x) count++ });
  const a = breaks[count-1],
        b = breaks[count];
  const colorA = colors[count-1],
        colorB = colors[count];
  const t = (x-a)/(b-a)
  return d3.interpolateLab(colorA, colorB)(t)
}

const getStateFill = d => {
  if (tiles.held.current == d.properties.NAME) return $('#color-3').val()
  if (tiles.hover.current == "Ocean" && !tiles.held.current) return fillNationalSum(d)
  else return fillStateSingle(d)
}

const fillStateSingle = d => {
  let stateA = tiles.held.current ? tiles.held.current : tiles.hover.current
  let stateB = d.properties.NAME
  let interCountrySum = getInterStateSum(stateA, stateB, getDirection())
  return getColor(interCountrySum)
}

const fillNationalSum = d => getColor(getSingleStateSum(d.properties.NAME, getDirection()))

const redrawSingleState = stateName => {
  const onHeldClick = (d,i) => {
    tiles.held.current = (tiles.held.current == i.properties.NAME) ? "" : i.properties.NAME;
    draw()
  }
  land.select(`#${stateName}`).remove();
  land.append("g")
    .selectAll("path")
    .data(data['countries'].features.filter(d => d.properties.NAME == stateName))
    .join("path")
    .attr("class","country-highlighted")
    .attr("id", (d, i) => d.properties.NAME)
    .attr("d", (d, i) => path(d))
    .attr("stroke", $('#color-3').val())
    .attr("stroke-width", "2")
    .attr("fill", (d, i) => getStateFill(d))
    .on("click", (d,i) => onHeldClick(d,i))
}

const drawAllStates = () => {
  land.append("g")
    .selectAll("path")
    .data(data['countries'].features.sort((a,b) => d3.ascending(a.properties.size, b.properties.size)))
    .join("path")
    .attr("d", (d, i) => path(d))
    .attr("fill", "transparent")
    .attr("stroke", "black")
    .attr("stroke-width","5")
    .attr("stroke-linecap","round")

  land.append("g")
    .selectAll("path")
    .data(data['countries'].features.sort((a,b) => d3.ascending(a.properties.size, b.properties.size)))
    .join("path")
    .attr("class","country")
    .attr("id", (d, i) => d.properties.NAME)
    .attr("d", (d, i) => path(d))
    .attr("fill", (d, i) => getStateFill(d))
    .attr("stroke", "transparent")
    .on('mouseover', function (d, i) {
      updateHoveredTile(i)
      updateLinks(i)
      updateTitle(i)
      updateSubtitle1(i)
      updateSubtitle2(i)
      if(tiles.held.current){
        redrawSingleState(tiles.hover.current)
        removeAllLinks()
        lonks = drawLinks()
      } else if (getNationLock()){
        redrawSingleState(i.properties.NAME)
      } else {
        $('#info-2').empty();
        d3.select(this)
          .style('fill', $('#color-3').val());
      }
    })
    .on("click", function(d,i) {
      if (tiles.held.current == i.properties.NAME) tiles.held.current = ""
      else tiles.held.current = i.properties.NAME
    })
}

const updateHoveredTile = i => {
  tiles.hover.previous = tiles.hover.current
  tiles.hover.current = i.properties.NAME
}
