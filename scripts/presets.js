// Create the settings for the pre-sets

const presetSettings = n => {
  if (n == 0){
    tiles = {
      'hover' : { 'previous' : '', 'current' : 'Ocean' },
      'held' :  { 'previous' : '', 'current' : ''}
    }
    $("#direction-select").val("in-mover");
  }
  else if (n == 1){
    tiles = {
      'hover' : { 'previous' : '', 'current' : 'California' },
      'held' :  { 'previous' : '', 'current' : 'California'}
    }
    $("#direction-select").val("net");
  }
  else if (n == 2){
    tiles = {
      'hover' : { 'previous' : '', 'current' : 'North Dakota' },
      'held' :  { 'previous' : '', 'current' : 'North Dakota'}
    }
    $("#direction-select").val("in-mover");
  }
  else if (n == 3){
    tiles = {
      'hover' : { 'previous' : '', 'current' : 'North Dakota' },
      'held' :  { 'previous' : '', 'current' : 'North Dakota'}
    }
    $("#direction-select").val("out-mover");
  }
  else if (n == 4){
    tiles = {
      'hover' : { 'previous' : '', 'current' : 'Delaware' },
      'held' :  { 'previous' : '', 'current' : 'Delaware'}
    }
    $("#direction-select").val("net");
  }
  else if (n == 5){
    tiles = {
      'hover' : { 'previous' : '', 'current' : 'New York' },
      'held' :  { 'previous' : '', 'current' : 'New York'}
    }
    $("#direction-select").val("net");
  }
  else if (n == 6){
    tiles = {
      'hover' : { 'previous' : '', 'current' : 'Puerto Rico' },
      'held' :  { 'previous' : '', 'current' : 'Puerto Rico'}
    }
    $("#direction-select").val("net");
  }
  draw();
}
