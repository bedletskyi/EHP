const path = require('path');
const fsExtra = require('fs-extra');
const fs = require('fs');
const homedir = require('os').homedir();

const defaultFilePath = homedir + '/EHP_log.txt';

const write = async (data, pathToFile = defaultFilePath) => {
  const fileExists = await exists(pathToFile);

  if (!fileExists) {
    await fs.open(pathToFile, 'w', () => {});
  }

  await fs.appendFile(pathToFile, data, () => {});
};

const exists = async filePath => {
  return fsExtra.existsSync(filePath);
};

module.exports = {
  write,
}
