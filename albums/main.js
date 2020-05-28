const scripts = require('./scripts')
const { app, BrowserWindow, webContents, ipcMain } = require('electron')
const Store = require('electron-store');
const albumStore = new Store();


require('electron-reload')(__dirname);

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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
app.whenReady().then(createWindow)

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



async function windowReady(window) {
  let datastring = await scripts.displayTestImage();
  //console.log(datastring)
  console.log("TESTING")
  //window.loadFile('test.html')
  return datastring
}

async function getTestDataString() {
  var datastring = await scripts.displayTestImage();
  //console.log(typeof(datastring))
  return datastring;
}

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg);
//   datastring = getTestDataString()
//   console.log(datastring)
//   event.returnValue = "teststring"
// })

ipcMain.on('asynchronous-message', async (event, arg) => {
  // let datastrings = [];
  // var datastring = await getTestDataString();
  // //console.log(datastring)
  // datastrings.push(datastring);
  // datastring = await scripts.getImageDataString('/mass/medix/Music/TesseracT/Polaris/01 Dystopia.mp3');
  // datastrings.push(datastring);

  var tags = await scripts.traverseDirectories();
  var baseString = '<div class="albumDiv"><img id="album" class="albumContainer" onclick="loadAlbumPage(' + "'testing'" + ')" src='
  var html = ""
  for (tag of tags) {
    var argString = "'" + tag[0] + "','" + tag[1] + "'";
    var innerString = "data:image/jpeg;base64," + tag[1];
    var imageHTML = '<div class="albumDiv"><img id="album" class="albumContainer" onclick="loadAlbumPage(' + argString + ')" src=' + innerString + "></div>"
   // console.log(imageHTML)
    html += imageHTML
  }

  console.log(tags.length + " albums loaded")
  event.reply('asynchronous-reply', html);
})

ipcMain.on('loadAlbum', async (event, arg) => {
  contents = webContents.getFocusedWebContents();
  contents.loadFile("albumView.html")
  albumStore.set('currentAlbum', arg)
  event.reply('albumLoaded', arg);
})

ipcMain.on('renderAlbum', async (event, arg) => {
  var album = await albumStore.get('currentAlbum');
  


  event.reply('albumRendered', album);
})


// function loadAlbumPage(albumAndArtist) {
//   console.log(albumAndArtist);
//   const { webContents } = require('electron');
// 	console.log(mainWindow)
  
// 	//console.log(window)
// }