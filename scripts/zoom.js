// Functions pertaining to the zooming of the map

// Set default zoom level to 1
let currentZoom = 1

// Define the D3 zoom element, restrict zooms to between 1 and 8
const zoom = d3.zoom()
  .scaleExtent([1, 8])
  .on("zoom", zoomed);

// Updates the zoom settings. Called every time the map zoom is changed
function zoomed({transform}) {
  currentZoom = transform.km          // Update variable to allow for easy access of current zoom level in other functions
  land.attr("transform", transform);  // Update map to display the proper zoom factor
}
