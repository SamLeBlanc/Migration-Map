const link_alert = () => {
  alert("hey")
}

const preset = n => {
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
  draw();
}
