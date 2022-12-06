// Functions to setup the hotkeys and center some headings/wrappers



// Positioning functions to center some divs
const centerHeading = () => {
  let innerWidth = window.innerWidth;
  let headingWidth = parseInt($('.heading').css('width'));
  $('.heading').css('left', 0.5 * (innerWidth - headingWidth))
}

const verticalCenterMap = () => {
  let initialTop = parseInt($('#wrapper').css('top'))
  let innerHeight = window.innerHeight
  let wrapperHeight = parseInt($('#wrapper').css('height'))
  let newTop = 0.5*(innerHeight-wrapperHeight)
  $('#wrapper').css({'top': Math.max(135,newTop+50)})
  $('.heading').css({'top': Math.max(5,newTop-35)})
}

const horizontalCenterWrappers = () => {
  ["#wrapper","#wrapper-2"].forEach(div => {
    let initialLeft = parseInt($(div).css('left'))
    let wrapperWidth = parseInt($(div).css('width'))
    let innerWidth = window.innerWidth
    let newLeft = 0.5 * (innerWidth-wrapperWidth)
    $(div).css({'left': newLeft})
  })
}

// Functions to collect the user-selected map settings
const getDirection = () => $('#direction-select').val()
const getLinks = () => $('#links-checkbox').is(':checked')
const getNationLock = () => $('#nation-lock').is(':checked')

// Creates the hotkey infrastructure that allows for fast changing of settings
// After any of the hotkeys are pressed, the map is redrawn
// O: toggle out-movers
// I: toggle in-movers
// N: toggle net in-movers
// L: toggle links
// K: toggle nation-lock (don't redraw map on hover)
const initialize = () => {

  horizontalCenterWrappers()
  // verticalCenterMap()
  centerHeading()
  d3.select("body")
    .on("keydown", e => {
      if (e.keyCode === 79)      $("#direction-select").val("out-mover") // O
      else if (e.keyCode === 73) $("#direction-select").val("in-mover")  // I
      else if (e.keyCode === 78) $("#direction-select").val("net")       // N
      else if (e.keyCode === 76) $('#links-checkbox').prop('checked', !getLinks())   // L
      else if (e.keyCode === 75) $("#nation-lock").prop('checked', !getNationLock()) // K
      draw()
  });
}

function abbrState(input, to){
    var states = [["Alabama","AL",4849509], ["Alaska","AK",722063], ["Arizona","AZ",7200620], ["Arkansas","AR",2989054], ["California","CA",39084048], ["Colorado","CO",5701658], ["Connecticut","CT",3531986], ["Delaware","DE",964817], ["District of Columbia","DC",697556], ["Florida","FL",21269409], ["Georgia","GA",10499808], ["Hawaii","HI",1396819], ["Idaho","ID",1764327], ["Illinois","IL",12536539], ["Indiana","IN",6656971], ["Iowa","IA",3121385], ["Kansas","KS",2879518], ["Kentucky","KY",4421512], ["Louisiana","LA",4595111], ["Maine","ME",1331656], ["Maryland","MD",5979602], ["Massachusetts","MA",6828110], ["Michigan","MI",9880758], ["Minnesota","MN",5575235], ["Mississippi","MS",2943737], ["Missouri","MO",6069697], ["Montana","MT",1056994], ["Nebraska","NE",1910711], ["Nevada","NV",3048602], ["New Hampshire","NH",1350155], ["New Jersey","NJ",8791672], ["New Mexico","NM",2073628], ["New York","NY",19240920], ["North Carolina","NC",10371906], ["North Dakota","ND",750501], ["Ohio","OH",11556037], ["Oklahoma","OK",3907258], ["Oregon","OR",4178578], ["Pennsylvania","PA",12670245], ["Puerto Rico","PR",3175835], ["Rhode Island","RI",1050602], ["South Carolina","SC",5092727], ["South Dakota","SD",872708], ["Tennessee","TN",6754461], ["Texas","TX",28642658], ["Utah","UT",3162102], ["Vermont","VT",617560], ["Virginia","VA",8439982], ["Washington","WA",7527366], ["West Virginia","WV",1773280], ["Wisconsin","WI",5760481], ["Wyoming","WY",572884]];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, txt => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input) return(states[i][1]);
        }
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input) return(states[i][0]);
        }
    } else if (to == 'pop'){
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input) return(states[i][2]);
        }
    }
}
