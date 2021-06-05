const { BrowserWindow, dialog } = require('electron');
const path = require('path');

const addJSONExtension = (filePath) => {
  if (filePath && !path.extname(filePath)) {
    return filePath.concat('.json');
  }

  return filePath;
};

const getPath = (customPath, useCustomPath) => {
  if (useCustomPath) {
    return customPath;
  }

  return path.normalize(customPath);
};

const openFile = (
  options,
  callback
) => {
  dialog
    .showOpenDialog({
      ...options,
      properties: ['openFile'],
    })
    .then((data) => {
      return callback(data.filePaths, data.bookmarks);
    })
    .catch((error) => {
      throw error;
    });
};

const saveFile = (options, callback) => {
  const {
    modelName,
    defaultPath,
    category,
    useCustomPath,
    skipJsonExtension,
    ...optionsForDialog
  } = options;
  const actualPath = `${getPath(defaultPath, useCustomPath)}/${modelName}`;

  dialog
    .showSaveDialog(new BrowserWindow(), {
      ...optionsForDialog,
      defaultPath: actualPath,
    })
    .then((data) => {
      const filePath = skipJsonExtension
        ? data.filePath
        : addJSONExtension(data.filePath || '');

      return callback(filePath, data.bookmark);
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = {
  openFile,
  saveFile
}
