// get parameter by name
// https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

// hiding content before live
if (findGetParameter('preview') != 'true' && new Date().getTime() < 1619526600000) {
  document.querySelector(".search").style.display = 'none';
  document.querySelector(".container").style.display = 'none';
  document.querySelector(".footer").style.display = 'none';
}

// scrolling animation
var scroll = window.requestAnimationFrame ||
      function(callback){ window.setTimeout(callback, 1000/60)};

function loop() {
  let largeHeading = document.getElementsByTagName("h1")[0];
  let smallHeading = document.getElementsByTagName("h2")[0];
  let festLogo = document.getElementsByClassName("capstone-fest-logo")[0];
  if (window.scrollY > window.innerWidth*.3) {
    smallHeading.style.opacity = 2*(window.scrollY-window.innerWidth*.3)/window.innerWidth/.3;
    festLogo.className = "capstone-fest-logo hidden";
    largeHeading.className = "hidden";
    smallHeading.className = "";
  } else {
    festLogo.style.opacity = (window.innerWidth*.3-window.scrollY)/window.innerWidth/.3;
    festLogo.className = "capstone-fest-logo";
    largeHeading.className = "";
    smallHeading.className = "hidden";
    largeHeading.style.opacity = (window.innerWidth*.3-window.scrollY)/window.innerWidth/.3;
  }
  scroll(loop);
}

loop();

class Tile {
  constructor(type, order, title, subtitle, description, link, image, tags) {
    this.type = type;
    this.order = order;
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.link = link;
    this.image = image;
    this.tags = tags;
    this.status = "";
  }
}

var app = new Vue({
  el: '#app',
  data: {
    search: '',
    searchInputVisible: false,
    tiles: [],
    tilesFilteredByTag: [],
    majors: [],
    activeTag: '',
    isSignedIn: true
  },
  methods: {
    filterTilesByTag: function(selectedTag) {
      this.activeTag = selectedTag;
      this.tilesFilteredByTag = this.tiles.filter(function (tile) {
        if (selectedTag) {
          if (tile.tags) {
            for (tag of tile.tags) {
              if (tag.toLowerCase() === selectedTag.toLowerCase()) {
                return true;
              }
            }
          }
          return false;
        } else {
          return true;
        }
      });
      window.scrollTo(0, window.innerWidth*.48);
    },
    onSearchEnter: function(el) {
      window.scrollTo(0, window.innerWidth*.48);
      el.children[0].focus();
    },
    removeFilters: function() {
      this.search = '';
      this.tilesFilteredByTag = this.tiles;
      this.activeTag = '';
    }
  },
  computed: {
    filteredVideoTiles: function() {
      return this.tilesFilteredByTag.filter(tile => {
        if (tile.type === "video") {
          if (tile.title.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.subtitle.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.type.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.description.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          } else if (tile.tags) {
            for (tag of tile.tags) {
              if (tag.toLowerCase().includes(this.search.toLowerCase())) {
                return true;
              }
            }
          }
        }
        return false;
      });
    },
    filteredLiveTiles: function() {
      return this.tilesFilteredByTag.filter(tile => {
        if (tile.type === "live") {
          if (tile.title.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.subtitle.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.type.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.description.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          } else if (tile.tags) {
            for (tag of tile.tags) {
              if (tag.toLowerCase().includes(this.search.toLowerCase())) {
                return true;
              }
            }
          }
        }
        return false;
      });
    },
    filteredRecordedTiles: function() {
      return this.tilesFilteredByTag.filter(tile => {
        if (tile.type === "recorded") {
          if (tile.title.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.subtitle.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.type.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.description.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          } else if (tile.tags) {
            for (tag of tile.tags) {
              if (tag.toLowerCase().includes(this.search.toLowerCase())) {
                return true;
              }
            }
          }
        }
        return false;
      });
    },
    filteredBookTiles: function() {
      return this.tilesFilteredByTag.filter(tile => {
        if (tile.type === "book") {
          if (tile.title.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.subtitle.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.type.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.description.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          } else if (tile.tags) {
            for (tag of tile.tags) {
              if (tag.toLowerCase().includes(this.search.toLowerCase())) {
                return true;
              }
            }
          }
        }
        return false;
      });
    },
    filteredProjectTiles: function() {
      if (this.searchInputVisible) {
        window.scrollTo(0, window.innerWidth*.48);
      }
      return this.tilesFilteredByTag.filter(tile => {
        if (tile.type === "project") {
          if (tile.title.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.subtitle.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.type.toLowerCase().includes(this.search.toLowerCase()) ||
              tile.description.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          } else if (tile.tags) {
            for (tag of tile.tags) {
              if (tag.toLowerCase().includes(this.search.toLowerCase())) {
                return true;
              }
            }
          }
        }
        return false;
      });
    }
  }
})

function updateCountdown(tile) {
  var goal = new Date(tile.subtitle);
  var timezone = 4;
  var now = new Date();
  var timediff = goal - now - timezone * 60 * 60 * 1000 - now.getTimezoneOffset() * 60 * 1000;
  var duration = tile.image;
  var a = duration.split(':');
  var durationInMillis = 0;
  if (a.length === 3) {
     durationInMillis = 1000 * ((+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]));
  }
  if (timediff > 0) {
    tile.status = "Starts in " + millis2time(timediff);
  } else if (-timediff > durationInMillis) {
    tile.status = "Ended";
    tile.order = (app.tiles.length+tile.order).toString();
  } else {
    tile.status = "Live Now";
    tile.order = '-1';
  }
  setTimeout(updateCountdown, 1000, tile);
}

function millis2time(timeInMillis) {
  var pad = function(num, size) { return ('000' + num).slice(size * -1); };
  var time = parseInt(timeInMillis);
  var hours = Math.floor(time / 60 / 60 / 1000);
  var minutes = Math.floor(time / 60 / 1000) % 60;
  var seconds = Math.floor(time / 1000 % 60);
  return hours + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}

function parseData(data) {
  const sheetNames = ["Projects", "Videos", "Live Events", "Recorded Events", "Archival Book"];
  let tiles = [];

  // loading projects
  let majors = [];
  let projectsData = data[sheetNames[0]];
  for (let i = 0; i < projectsData.length; i++) {
    tiles.push(new Tile('project',
      projectsData[i]['Order'] ? projectsData[i]['Order'] : "",
      projectsData[i]['Title'] ? projectsData[i]['Title'] : "",
      projectsData[i]['Preferred Name'] ? projectsData[i]['Preferred Name'] : (projectsData[i]['First Name'] ? projectsData[i]['First Name'] + " ": "")+(projectsData[i]['Last Name'] ? projectsData[i]['Last Name'] : ""),
      projectsData[i]['Description'] ? projectsData[i]['Description'] : "",
      projectsData[i]['Link'] ? projectsData[i]['Link'] : "",
      projectsData[i]['Image Link'] ? projectsData[i]['Image Link'] : "",
      projectsData[i]['Tags'] ? projectsData[i]['Tags'].split(', ') : []));
    if (!majors.some(major => major.name === projectsData[i]['Major'])) {
      majors.push({ name: projectsData[i]['Major'] });
    }
  }
  app.majors = majors;

  // loading live events
  let liveEventsData = data[sheetNames[2]];
  for (let i = 0; i < liveEventsData.length; i++) {
    tiles.push(new Tile('live',
      liveEventsData[i]['Order'] ? liveEventsData[i]['Order'] : '',
      liveEventsData[i]['Title'] ? liveEventsData[i]['Title'] : '',
      liveEventsData[i]['Time'] ? liveEventsData[i]['Time'] : '',
      liveEventsData[i]['Description'] ? liveEventsData[i]['Description'] : '',
      liveEventsData[i]['Link'] ? liveEventsData[i]['Link'] : '',
      liveEventsData[i]['Duration'] ? liveEventsData[i]['Duration'] : '',
      liveEventsData[i]['Tags'] ? liveEventsData[i]['Tags'].split(', ') : []));
  }

  // loading recorded events
  let recordedEventsData = data[sheetNames[3]];
  for (let i = 0; i < recordedEventsData.length; i++) {
    tiles.push(new Tile('recorded',
      recordedEventsData[i]['Order'] ? recordedEventsData[i]['Order'] : '',
      recordedEventsData[i]['Title'] ? recordedEventsData[i]['Title'] : '',
      recordedEventsData[i]['Time'] ? recordedEventsData[i]['Time'] : '',
      recordedEventsData[i]['Description'] ? recordedEventsData[i]['Description'] : '',
      recordedEventsData[i]['Link'] ? recordedEventsData[i]['Link'] : '',
      '',
      recordedEventsData[i]['Tags'] ? recordedEventsData[i]['Tags'].split(', ') : []));
  }

  // loading videos
  let videoData = data[sheetNames[1]];
  for (let i = 0; i < videoData.length; i++) {
    tiles.push(new Tile('video',
      videoData[i]['Order'] ? videoData[i]['Order'] : '',
      videoData[i]['Title'] ? videoData[i]['Title'] : '',
      '',
      videoData[i]['Description'] ? videoData[i]['Description'] : '',
      videoData[i]['Video Link'] ? videoData[i]['Video Link'] : '',
      videoData[i]['Cover Link'] ? videoData[i]['Cover Link'] : '',
      videoData[i]['Tags'] ? videoData[i]['Tags'].split(', ') : []));
  }

  // loading archival book
  let bookData = data[sheetNames[4]];
  for (let i = 0; i < bookData.length; i++) {
    tiles.push(new Tile('book',
      bookData[i]['Order'] ? bookData[i]['Order'] : '',
      bookData[i]['Title'] ? bookData[i]['Title'] : '',
      '',
      '',
      bookData[i]['Book Link'] ? bookData[i]['Book Link'] : '',
      bookData[i]['Image Link'] ? bookData[i]['Image Link'] : '',
      bookData[i]['Tags'] ? bookData[i]['Tags'].split(', ') : []));
  }

  app.tiles = tiles;
  app.tilesFilteredByTag = tiles;
  window.scrollTo(0,0);

  for (tile of app.tiles) {
    if (tile.type === "live") {
      updateCountdown(tile);
    }
  }
}

// getting sample data
/*
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    parseData(JSON.parse(this.responseText));
  }
};

xhttp.open("GET", "sample-data/sample-database.json", true);
xhttp.send();

*/

// getting data from php
function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest(); // New request object
oReq.onload = function() {
  // This is where you handle what to do with the response.
  // The actual data is found on this.responseText
  //parseData(this.responseText); // Will alert: 42
  const sheetNames = ["Projects", "Videos", "Live Events", "Recorded Events", "Archival Book"];
  var response = JSON.parse(this.responseText);

  var data = new Object();
  for (var k = 0; k < response.valueRanges.length; k++) {
    var range = response.valueRanges[k];
    if (range.values.length > 0) {
      let columnNames = [];
      var sheetData = [];
      for (let i = 0; i < range.values[0].length; i++) {
        columnNames.push(range.values[0][i]);
      }
      for (let i = 1; i < range.values.length; i++) {
        let rowData = new Object();
        for (let j = 0; j < range.values[i].length; j++) {
          rowData[columnNames[j]] = range.values[i][j];
        }
        sheetData.push(rowData);
      }
      for (sheetName of sheetNames) {
        if (range.range.includes(sheetName)) {
            data[sheetName] = sheetData;
        }
      }

    }
  }

  parseData(data);

};
oReq.open("get", "get-data.php", true);
//                               ^ Don't block the rest of the execution.
//                                 Don't wait until the request finishes to
//                                 continue.
oReq.send();
