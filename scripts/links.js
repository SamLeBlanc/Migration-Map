// Functions pertaining to the links (lines) between countries (press L)

// Creates an array with the data for creating links between countries
// Each link contains the names of the linked countries, the source and target coordinates, and
// the link value (the amount of trade in millions) and weight (calculated width of the link)
// Can be called with only stateA or can be called with both stateA and stateB
// If only stateA, it will return links between stateA and all other countries (up to ~200)
// If both stateA and stateB, then only one link (between the two coutnries) will be returned
const createLinkArray = (stateA, stateB = "") => {
  // Get all applicable links for only stateA
  let countryData = getSingleStateData(stateA, getDirection())

  // If stateB was provided, filter data to only include the one link between stateA and stateB
  countryData = stateB ? countryData.filter(d => d.stateB == stateB) : countryData

  // Use the map command to map data into actual links by adding it to the dictionary
  let links = countryData.map( d => {
    return {
      'stateA' : d.stateA,
      'stateB' : d.stateB,
      'source': [+d.A_long, +d.A_lat],
      'target': [+d.B_long, +d.B_lat],
      'value' : +d.Value, // actual trade value (in millions of USD)
      'weight': 2*(+d.Value)**0.2 // formula to calculate realtive width of link
    }
  })

  // Sort links according to weight (so the most common trade routes are on top)
  links = links.sort((a,b) => d3.descending(+a.weight, +b.weight))
  return links
}

// Update the link arrays to hold the new links, and redraw the map.
const updateLinks = i => {
  if (tiles.held.current) {
    // Get single link between held country and hovered country
    links = createLinkArray(tiles.held.current, tiles.hover.current)
    draw()
  } else if (tiles.hover.current != tiles.hover.previous){
    // Get links between hovered country and all other countries
    links = createLinkArray(tiles.hover.current)
    // Slice array to only include the number of requested links based on settings
    number_of_links = parseInt($("#links-number").val())
    links = links.slice(0, number_of_links);
    draw()
  }
}

// Get the color of the link based on the trade direction of interest
const getLinkColor = () => {
  let direction = getDirection();
  if (direction == 'in-mover') return 'blue'
  if (direction == 'out-mover') return 'purple'
  if (direction == 'net') return 'orange'
}

// Remove all links form the map based on class name .link
const removeAllLinks = () => d3.selectAll('.link').remove();

// Returns boolean based on whether links 'should' be displayed currently
const displayLinks = () => (getLinks() && tiles.hover.current != "Ocean");

// Draw the links on the map if the option is selected.
function drawLinks(){
  if (!displayLinks()) return land.append("g")
  removeAllLinks()
  const lonks = land.append("g")
    .selectAll("myPath")
    .data(links)
    .enter()
    .append("path")
    .attr("class","link")
    .attr('d', d => linkToArc(d, 3))
    .style("stroke-width", d => d.weight/2 )
    .style('stroke', getLinkColor())
    .on('mouseover', function (d, i) {
        if (!tiles.held.current){
          updateSubtitle2(i)
          d3.select(this).style('stroke', 'green');
       }
    })
    .on('mouseout', function (d, i) {
      $('#info-2').empty();
      d3.select(this).style('stroke', getLinkColor());
    });
  return lonks
}

// Updates the second subtitle under the map title
// The second subtitle desrcribes the interchange between stateA and stateB
const updateSubtitle2 = i => {
  if(!tiles.held.current || tiles.hover.current == 'Ocean'){
    $('#info-2').html(``)
    return
  }

  // Color text black to display subtitle
  $('#info-2').css('color','black')

  // Get stateA and stateB names and the value of link
  if (tiles.held.current) {
    // If a country is hovered over while another is held
    stateA = tiles.held.current;
    stateB = i.properties.NAME;
    if (stateA == stateB) {
      $('#info-2').css('color','grey')
      $('#info-2').html(`Hover over another state to learn more...`)
      return
    }
    value = getInterStateSum(stateA, stateB, getDirection())
  } else {
    // If the link itself is hovered over
    stateA = i.stateA; stateB = i.stateB;
    value = i.value
  }

  // Get country sum to caclulate the percentage of trade accounted for by the link
  let countrySum = getSingleStateSum(stateA, getDirection())
  let percent = value/countrySum;
  percent = percent < .03 ? Math.round(1000*percent,1)/10 : Math.round(100*percent)

  // Use direction to get proper past tense verb for subtitle
  let direction = getDirection();
  if (direction == 'in-mover') action = 'came from'
  if (direction == 'out-mover') action = 'went to'
  if (direction == 'net') action = 'were accounted for by'

  percent_str = (direction != 'net') ? ` (${percent}%)` : ``

  // Combine the above gathered info into a single string and set as subtitle
  value = (parseInt(value) > 0 && parseInt(value) < 100) ? '<100' : value.toLocaleString("en-US")
  $('#info-2').html(`Of those, ${value}${percent_str} ${action} <span class='info-2-stateB'>${stateB}</span>.`)
  $('.info-2-stateB').css({'color': $('#color-3').val(), '-webkit-text-stroke': '0.5px black'})
}

// Determine the path of the link between stateA and stateB
// Based on the bend factor, where a lower number means more bend
const linkToArc = (d, bend = 1) => {
  // Get longitude and latitude of source and target points
  let sourceLngLat = d['source'], targetLngLat = d['target'];

  // If either of the previous arrays are invalid, return a 'null line'
  if (!(targetLngLat && sourceLngLat)) return "M0,0,l0,0z";

  // Use projection to calculate SVG coordinates of source and target locations
  let sourceXY = projection(sourceLngLat), targetXY = projection(targetLngLat);

  // Split up source and target arrays into the seperate x and y SVG coordinates
  let sourceX = sourceXY[0], sourceY = sourceXY[1];
  let targetX = targetXY[0], targetY = targetXY[1];

  // Calculate change in x and y, from target to source
  let dx = targetX - sourceX, dy = targetY - sourceY;

  // Calculate the arc of link, accounting for the given bend factor
  let dr = Math.sqrt(dx * dx + dy * dy) * bend;

  // To avoid a whirlpool effect, and make the bend direction consistent,
  // determine whether the target was west or east of the source
  var west_of_source = (targetX - sourceX) < 0;

  // Return d attribute of path determined by whether target was west of source
  if (west_of_source) {
    return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
  } else {
    return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
  }
}
