const { ipcMain } = require('electron');
const {convertExcelToJson} = require('./importExcel');
const {exportDataToExcel} = require('./exportExcel');
const {parseDataFromHotline} = require('./parsingService');
const {notificationService} = require('./notificationService');

const eventHelper = {
  setEventHandlers() {
    this.fsEvents();
    this.parsingEvents();
  },

  fsEvents() {
    ipcMain.on('excel-import', async (event) => {
      const data = await convertExcelToJson();
      event.reply('excel-import-reply', data);
    });

    ipcMain.on('export-excel', async (_event, data) => {
      exportDataToExcel(data);
    });
  },

  parsingEvents() {
    ipcMain.on('start-parsing', async (event, data) => {
      const parsedData = await parseDataFromHotline(data, (progress) => {
        event.reply('parsing-progress', progress);
      });
      event.reply('parsing-reply', parsedData);
      notificationService.notify('Parsing hotline finished');
      exportDataToExcel(parsedData);
    });
  },
};

module.exports = {
  eventHelper
};
