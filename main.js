const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { revealLobby, getLoLPid } = require('./reveal')

console.log('\r\n \/$$      \/$$             \/$$                                        \r\n| $$$    \/$$$            | $$                                        \r\n| $$$$  \/$$$$  \/$$$$$$  \/$$$$$$    \/$$$$$$  \/$$   \/$$  \/$$$$$$$      \r\n| $$ $$\/$$ $$ |____  $$|_  $$_\/   \/$$__  $$| $$  | $$ \/$$_____\/      \r\n| $$  $$$| $$  \/$$$$$$$  | $$    | $$$$$$$$| $$  | $$|  $$$$$$       \r\n| $$\\  $ | $$ \/$$__  $$  | $$ \/$$| $$_____\/| $$  | $$ \\____  $$      \r\n| $$ \\\/  | $$|  $$$$$$$  |  $$$$\/|  $$$$$$$|  $$$$$$\/ \/$$$$$$$\/      \r\n|__\/     |__\/ \\_______\/   \\___\/   \\_______\/ \\______\/ |_______\/       \r\n                                                                     \r\n                                                                     \r\n                                                                     \r\n\nGitHub: https://github.com/VOTRON157\nRodando')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    title: 'Lobby Reveal',
    icon: './images/icon.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.setTitle('Lobby Reveal')

  ipcMain.on('revel-summoners', async (event, title) => {
    const lolIsOpen = await getLoLPid()
    if(!lolIsOpen) return event.reply('show-summoners', 'Seu League of Legends não está aberto.')
    const summoner = await revealLobby()
    if(!summoner) return event.reply('show-summoners', 'Você não está em uma seleção de campeões.')
    console.log('\n\nSummoners name: ' + summoner.split('summoners=')[1])
    console.log('OPGG Link: ' + summoner)
    win.loadURL(summoner)
  })

  win.loadFile('interface.html')
}


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})