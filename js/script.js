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
    tiles: [new Tile('loading capstones...','','','','','',[])],
    tilesFilteredByTag: [new Tile('loading capstones...','','','','','',[])],
    majors: [{name: 'loading majors...'}]
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
      console.log(el.children[0].focus());
    }
  },
  computed: {
    filteredTiles: function() {
      if (this.searchInputVisible) {
        window.scrollTo(0, window.innerWidth*.48);
      }
      return this.tilesFilteredByTag.filter(tile => {
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
        return false;
      });
    }
  }
})

function init() {
  Tabletop.init( {
    key: 'https://docs.google.com/spreadsheets/d/19seYcWtzkf4YZTyaobE63dm8B9k0_9dqv0RZ4l5Vo-Q/edit?usp=sharing',
    simpleSheet: false }
  ).then(function(data, tabletop) {
    console.log(data);
    let tiles = [];

    // loading projects
    let majors = [];
    projectsData = data["Projects"].elements;
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
    liveEventsData = data["Live Events"].elements;
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
    recordedEventsData = data["Recorded Events"].elements;
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
    videoData = data["Videos"].elements;
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
    bookData = data["Archival Book"].elements;
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
    console.log('top');
  })
}
window.addEventListener('DOMContentLoaded', init)
