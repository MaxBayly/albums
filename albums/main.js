const scripts = require('./scripts')
const { app, BrowserWindow, webContents, ipcMain } = require('electron')
const Store = require('electron-store');
const albumStore = new Store();

var exec = require('child_process').exec, child;
var albumDict = new Map();
var albumsLoaded = false;


require('electron-reload')(__dirname);

function createWindow () {
  // Create the browser window.
  //sleep(1000)
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    webPreferences: {
	  nodeIntegration: true,
	  "webSecurity": false
    }
  })


  // and load the index.html of the app.
  win.loadFile('index.html')

  //windowReady(win);

  // Open the DevTools.
  win.webContents.openDevTools()

  win.removeMenu()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(createWindow)

app.on('ready', function () {
  setTimeout(function() {
      createWindow();
  }, 300);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//let test = scripts.readTags()


async function getTestDataString() {
  var datastring = await scripts.displayTestImage();
  //console.log(typeof(datastring))
  return datastring;
}


ipcMain.on('load-images', async (event, arg) => {
  // let datastrings = [];
  // var datastring = await getTestDataString();
  // //console.log(datastring)
  // datastrings.push(datastring);
  // datastring = await scripts.getImageDataString('/mass/medix/Music/TesseracT/Polaris/01 Dystopia.mp3');
  // datastrings.push(datastring);
  console.log("Loading albums...")

  if (!albumsLoaded){
    var tags = await scripts.traverseDirectories();
    //var baseString = '<div class="albumDiv"><img id="album" class="albumContainer" onclick="loadAlbumPage(' + "'testing'" + ')" src='
    var html = ""
    for (tag of tags) {
      albumDict.set(tag[0], tag[1])
      var argString = "'" + tag[0] + "'";
      var innerString = "data:image/jpeg;base64," + tag[1];
      var imageHTML = '<div class="albumDiv"><img id="album" class="albumContainer" onclick="loadAlbumPage(' + argString + ')" src=' + innerString + "></div>"
      html += imageHTML
    }
    albumStore.set('html', html);
    albumsLoaded = true;
    console.log(tags.length + " albums loaded");
  } else {
    var html = albumStore.get('html');
  }

  event.reply('albums-loaded', html);
})

ipcMain.on('loadAlbum', async (event, albumAndArtist) => {
  contents = webContents.getFocusedWebContents();
  contents.loadFile("albumView.html")

  albumStore.set('currentAlbum', albumAndArtist);
  event.reply('albumLoaded', 'loaded album');
})

ipcMain.on('renderAlbum', async (event, arg) => {
  var album = await albumStore.get('currentAlbum');
  var htmlString = '<img onClick="playAlbum()" src="data:image/jpeg;base64,' + albumDict.get(album) + '">'


  event.reply('albumRendered', htmlString);
})

ipcMain.on('renderSongs', async (event, arg) => {
  var albumAndArtist = albumStore.get('currentAlbum');
  var info = await scripts.getAlbumSongs(albumAndArtist);
  var artist = albumAndArtist.substr(0, albumAndArtist.indexOf('/'));
  var songs = info[0];
  var album = info[1];
  
  var artistHTML = '<div onClick="goBack()" class="artist">' + artist 
  var albumHTML = '<div onClick="goBack()" class="album">' + album
  var songsHTML = '<div class="songs">'

  for (song of songs) {
    var songHTML = '<div id="' + song[1] + '" class="song">' + song[0] + '</div>';
    songsHTML += songHTML;
  }
  songsHTML += '</div>';
  var html = artistHTML + albumHTML + songsHTML;

  event.reply('songsFetched', html);
})

ipcMain.on('loadGrid', async(event, arg) => {
  contents = webContents.getFocusedWebContents();
  contents.loadFile("index.html");
  event.reply('gridLoaded', "album grid loaded");
})

ipcMain.on('playCurrentAlbum', async(event, arg) => {
  var execString = 'mpc clear && mpc ls "' + albumStore.get('currentAlbum') + '" | mpc add && mpc play'
	
	child = exec(execString,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });
})


// function loadAlbumPage(albumAndArtist) {
//   console.log(albumAndArtist);
//   const { webContents } = require('electron');
// 	console.log(mainWindow)
  
// 	//console.log(window)
// }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}