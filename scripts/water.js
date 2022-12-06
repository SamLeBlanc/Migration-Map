// Functions pertaining to the water tile

// Create the SVG background that soft resets the map when hovered over
const drawWater = () => {
  ocean.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'transparent')
  .on('mouseover', (d, i) => {
    // When ocean is hovered over, soft reset the map to its base state
    tiles.hover.previous = tiles.hover.current
    tiles.hover.current = "Ocean"
    updateTitle(i)
    updateSubtitle1(i)
    // Since the hovered country has been change, we must redraw the map
    draw()
  })
}
