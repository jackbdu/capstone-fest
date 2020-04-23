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
  constructor(type, title, subtitle, description, link, image, tags) {
    this.type = type;
    this.title = title;
    this.subtitle = subtitle;
    this.description = description;
    this.link = link;
    this.image = image;
    this.tags = tags;
  }
}

var app = new Vue({
  el: '#app',
  data: {
    search: '',
    searchInputVisible: false,
    tiles: [],
    tilesFilteredByTag: [],
    majors: []
  },
  methods: {
    filterTilesByTag: function(selectedTag) {
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
      el.children[0].focus();
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
      if (this.searchInputVisible && !isMobileDevice) {
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

// Client ID and API key from the Developer Console
var CLIENT_ID = '872432590149-9njmctf5n0dqarh2d8b53suggj50rnvg.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDMDqqNf2u8kLYubDhJ_rNYV1Qai_FWZPU';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    loadData();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    removeData();
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  console.log("Google API: "+message);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function loadData() {
  const sheetNames = ["Projects", "Videos", "'Live Events'", "'Recorded Events'", "'Archival Book'"];

  gapi.client.sheets.spreadsheets.values.batchGet({
    spreadsheetId: '149I1zwGZUTgrriM0lS5FgHSP_Px2wSlLftMDQN6vt6g',
    ranges: sheetNames,
  }).then(function(response) {
    var data = new Object();
    for (var k = 0; k < response.result.valueRanges.length; k++) {
      var range = response.result.valueRanges[k];
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

    let tiles = [];

    // loading projects
    let majors = [];
    let projectsData = data[sheetNames[0]];
    for (let i = 0; i < projectsData.length; i++) {
      tiles.push(new Tile('project',
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
        liveEventsData[i]['Title'] ? liveEventsData[i]['Title'] : '',
        liveEventsData[i]['Time'] ? liveEventsData[i]['Time'] : '',
        liveEventsData[i]['Description'] ? liveEventsData[i]['Description'] : '',
        liveEventsData[i]['Link'] ? liveEventsData[i]['Link'] : '',
        '',
        liveEventsData[i]['Tags'] ? liveEventsData[i]['Tags'].split(', ') : []));
    }

    // loading recorded events
    let recordedEventsData = data[sheetNames[3]];
    for (let i = 0; i < recordedEventsData.length; i++) {
      tiles.push(new Tile('recorded',
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

  }, function(response) {
    console.log('Error: ' + response.result.error.message);
  });
}

function removeData() {
  app.tiles = [];
  app.tilesFilteredByTag = [];
  app.majors = []
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};
