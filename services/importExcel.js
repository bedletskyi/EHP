const Excel = require('exceljs');
const { openFile } = require("./fileDialogService");

const TITLE_ROW = 1;
const NUMERIC_KEYWORDS = ['price'];

const readFile = (filePath) => {
  const workbook = new Excel.Workbook();

  return workbook.xlsx.readFile(filePath);
};

const chooseFile = () =>
  new Promise((resolve) => {
    openFile(
      {
        filters: [
          {
            name: 'xlsx',
            extensions: ['xlsx'],
          },
          {
            name: 'xls',
            extensions: ['xls'],
          },
        ],
      },
      (fileNames) => resolve(fileNames[0])
    );
  });

const mapCells = (
  row,
  iteratee,
  options
) => {
  let result = [];

  row.eachCell(options, (cell) => {
    const item = iteratee(cell);

    result = [...result, item];
  });

  return result;
};

const getValues = (row) =>
  mapCells(row, (cell) => cell.toString(), {
    includeEmpty: true,
  });

const isRowEmpty = (row) =>
  getValues(row)
    .map((value) => value.trim)
    .filter(Boolean).length === 0;

const mapRows = (page, iteratee) => {
  let result = [];

  page.eachRow((row, i) => {
    if (i === TITLE_ROW) {
      return;
    }

    if (isRowEmpty(row)) {
      return;
    }

    const item = iteratee(row);

    result = [...result, item];
  });

  return result;
};

const combineData = (titles, data) => {
  return titles.reduce((result, name, i) => {
    const isNumeric = NUMERIC_KEYWORDS.includes(name);
    const value = isNumeric ? parseInt(data[i], 10) : data[i];

    return { ...result, [name]: value };
  }, {});
};

const convertExcelRowToJson = (titles, row) => {
  return combineData(titles, getValues(row));
};

const convertExcelPageToJson = (page) => {
  if (!page) {
    return [];
  }

  const titles = getValues(page.getRow(TITLE_ROW)).map((title) =>
    title.toLowerCase()
  );

  return mapRows(page, (row) => {
    return convertExcelRowToJson(titles, row);
  });
};

const convertExcelToJson = () =>
  new Promise((resolve, reject) => {
    chooseFile()
      .then((filePath) => readFile(filePath))
      .then((workbook) => {
        const worksheet = workbook.worksheets[0];
        const data = convertExcelPageToJson(worksheet);

        return resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });

module.exports = {
  convertExcelToJson,
}
