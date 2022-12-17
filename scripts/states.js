const updateTitle = (i=null) => {
  if (tiles.hover.current == "Ocean" && !tiles.held.current){
    let titleDirection = $('#direction-select').find(":selected").text()
    $('.title').html(`
        <span id="title-state" style="color: ${$('#color-3').val()}">National</span>
        <span id="title-direction">${titleDirection.slice(0,-4)}</span>
        <div class="tooltip">
          <img src="assets/i-icon.png" class="icon-i">
          <span class="tooltiptext"  style="width:300px">${mainTooltip()}</span>
        </div>`)
  } else {
    let stateA = (tiles.held.current || i == null) ? tiles.held.current : i.properties.NAME
    if (getDirection() == 'in-mover') titleDirection = 'In-movers to'
    if (getDirection() == 'out-mover') titleDirection = 'Out-movers from'
    if (getDirection() == 'net') titleDirection    = 'Net Movers to/from'
    $('.title').html(`
      <span id="title-direction">${titleDirection}</span>
      <span id="title-state" style="color: ${$('#color-3').val()}">${stateA}</span>
      <div class="tooltip">
        <img src="assets/i-icon.png" class="icon-i">
        <span class="tooltiptext"  style="width:300px">${mainTooltip()}</span>
      </div>`)
  }
}

const mainTooltip = () => {
  let text = ''
  if (tiles.hover.current == 'Ocean' && getDirection() != 'net' && tiles.held.current == ''){
    text = `The current data shows the total number of interstate ${getDirection()}s to each state during 2019.
    An ${getDirection()} is defined as a person who moved ${getDirection()=='in-mover'?" in to":"out of"} that
    state in the previous year. The darker color means more ${getDirection()}s`
  } else if (tiles.hover.current == 'Ocean' && getDirection() == 'net' && tiles.held.current == ''){
    text = `The current data shows the total number of net movers to each state during 2019.
    Net movers are calculated as the number of interstate in-movers minus
    the number of interstate out-movers. The darker color means higher absolute values of movers.`
  } else if ((tiles.hover.current != 'Ocean' || tiles.held.current != '' ) && getDirection() != 'net'){
      text = `The current data shows the number of interstate ${getDirection()}s who moved ${getDirection()=='in-mover'?" in to":"out of"}
      ${$('#title-state').text()} during 2019. An ${getDirection()} is defined as a person who moved ${getDirection()=='in-mover'?" in to":"out of"} ${$('#title-state').text()}
      in the previous year. The darker color means more ${getDirection()}s`
  } else if ((tiles.hover.current != 'Ocean' || tiles.held.current != '' ) && getDirection() == 'net'){
      text = `The current data shows the number of interstate net-movers
      for ${$('#title-state').text()} during 2019. Net movers are calculated as the number of interstate in-movers to ${$('#title-state').text()} minus
      the number of interstate out-movers from ${$('#title-state').text()}.`
    }
  return text
}

const updateSubtitle1 = i => {
  $('#info-1').text("Hover over a state to learn more...").css('color','grey')
  if (tiles.hover.current != "Ocean" || tiles.held.current != ''){
    let stateA = tiles.held.current ? tiles.held.current : i.properties.NAME;
    let countrySum = getSingleStateSum(stateA, getDirection())
    let direc = getDirection() == 'net' ? 'net in-movers' : getDirection()
    let string = `In 2019, ${stateA} had ~${(Math.round(countrySum/100)*100).toLocaleString("en-US")} ${direc}s.`
    if (getDirection() == 'net') {
      let direc = getDirection() == 'net' ? 'net in-movers' : getDirection()
      let sign = (Math.round(countrySum/100)*100) > 0 ? "gain" : "loss";
      let string = `In 2019, ${stateA} had a net movers ${sign} of ~${Math.abs(Math.round(countrySum/100)*100).toLocaleString("en-US")}.`
    }
    $('#info-1').text(string).css('color','black')
  }
}

const getSingleStateData = (stateA, direction) => data['2020'].filter( e => e.stateA == stateA && e.Direction == direction )

const getSingleStateSum = (stateA, direction) => {
  if (direction != 'net') return d3.sum(getSingleStateData(stateA, direction).map(e => +e.Value))
  else return (d3.sum(getSingleStateData(stateA, 'in-mover').map(e => +e.Value)) - d3.sum(getSingleStateData(stateA, 'out-mover').map(e => +e.Value)))
}

const getInterStateData = (stateA, stateB, direction) => data['2020'].filter( e => e.stateA == stateA && e.stateB == stateB && e.Direction == direction )

const getInterStateSum = (stateA, stateB, direction) => {
  if (direction != 'net') return d3.sum(getInterStateData(stateA, stateB, direction).map(e => +e.Value))
  else return (d3.sum(getInterStateData(stateA, stateB, 'in-mover').map(e => +e.Value)) - d3.sum(getInterStateData(stateA, stateB, 'out-mover').map(e => +e.Value)))
}

const getColor = x => (getDirection() == 'net') ? colorNetExports(x) : colorImportExport(x)

const colorImportExport = x => {
  if (Math.abs(x) < 0.1) return "#ddd"

  let breaks = [0,100,500,1000,5000,10000,50000,100000,500000];
  let out_colors = [...Array(9).keys()].map(d => d3.interpolateRgb("lightgrey", $('#color-1').val() )((  Math.min(1,d/8)  ) ))
  let in_colors = [...Array(9).keys()].map(d => d3.interpolateRgb("lightgrey", $('#color-2').val() )((  Math.min(1,d/8)  ) ))
  let colors = getDirection() == 'in-mover' ? in_colors : out_colors;

  let pos = breaks.filter(n => n<x).length
  let [a, b] = [ breaks[pos-1], breaks[pos] ]
  let [colorA, colorB] = [ colors[pos-1], colors[pos] ]
  return d3.interpolateLab(colorA, colorB)((x-a)/(b-a))
}

const colorNetExports = x => {
  if (x == 0) return "#ddd"
  let out_colors = [...Array(9).keys()].reverse().map(d => d3.interpolateRgb("lightgrey", $('#color-1').val() )(d/8))
  let in_colors = [...Array(9).keys()].map(d => d3.interpolateRgb("lightgrey", $('#color-2').val() )(d/8))
  let breaks = [-1000000,-500000,-100000,-50000,-10000,-5000,-1000,-500,-100,0,100,500,1000,5000,10000,50000,100000,500000,1000000];
  let colors = out_colors.concat(['#fff'], in_colors)

  let pos = breaks.filter(n => n<x).length
  let [a, b] = [ breaks[pos-1], breaks[pos] ]
  let [colorA, colorB] = [ colors[pos-1], colors[pos] ]
  return d3.interpolateLab(colorA, colorB)((x-a)/(b-a))
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
