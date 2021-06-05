const Excel = require('exceljs');
const { dialog, shell } = require('electron');

const SHORT_COLUMN_WIDTH = 12;
const MIDDLE_COLUMN_WIDTH = 25;
const LONG_COLUMN_WIDTH = 90;
const XLSX_EXTENSION = 'xlsx';

const prepareDataToExport = (data) => {
  return data.map((item) => {
    return {
      sku: item.sku,
      name: {
        text: item.name,
        hyperlink: item.link,
        tooltip: item.link,
      },
      price: item.price,
      store: item.store,
      hotlinePrice: item.hotlinePrice,
      underbidding: item.hotlinePrice / item.price - 1,
      hotlinePosition: item.hotlinePosition,
      storeLink: {
        text: 'To store',
        hyperlink: item.storeLink,
        tooltip: item.storeLink,
      }
    };
  });
};

const getColumns = () => {
  const style = { alignment: { wrapText: false } };
  return [
    {
      header: 'SKU',
      key: 'sku',
      width: SHORT_COLUMN_WIDTH,
      style,
    },
    {
      header: 'Product name',
      key: 'name',
      width: LONG_COLUMN_WIDTH,
      style: {
        ...style,
        font: { underline: true, color: { argb: 'FF4285f4' } },
      },
    },
    {
      header: 'RRC',
      key: 'price',
      width: SHORT_COLUMN_WIDTH,
      style,
    },
    {
      header: 'Store name',
      key: 'store',
      width: MIDDLE_COLUMN_WIDTH,
      style,
    },
    {
      header: 'Hotline',
      key: 'hotlinePrice',
      width: SHORT_COLUMN_WIDTH,
      style,
    },
    {
      header: 'Underbidding',
      key: 'underbidding',
      width: SHORT_COLUMN_WIDTH,
      style: { ...style, numFmt: '0.00%' },
    },
    {
      header: 'Hotline position',
      key: 'hotlinePosition',
      width: SHORT_COLUMN_WIDTH,
      style,
    },
    {
      header: 'Link to store',
      key: 'storeLink',
      width: SHORT_COLUMN_WIDTH,
      style: {
        ...style,
        font: { underline: true, color: { argb: 'FF4285f4' } },
      },
    },
  ];
};

const setWorksheetParams = (worksheet) => {
  worksheet.state = 'visible';
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  worksheet.getRow(1).font = { bold: true };
  return worksheet;
};

const appendSheet = (
  workbook,
  sheetName,
  xlsData
) => {
  const test = xlsData.map((row) => Object.values(row));
  let worksheet = workbook.addWorksheet(sheetName);
  worksheet.columns = getColumns();
  worksheet.addRows(test);
  worksheet = setWorksheetParams(worksheet);
};

const createWorkBook = (data) => {
  const xlsData = prepareDataToExport(data);
  const workbook = new Excel.Workbook();
  appendSheet(workbook, 'Scan', xlsData);
  return workbook;
};

const convertErrorObject = (error) => {
  if (typeof error === 'object') {
    return JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }
  return error;
};

const writeDataToExcelFile = (xlsData, filePath) =>
  xlsData.xlsx.writeFile(filePath);

const exportDataToExcel = (data) => {
  try {
    const xlsData = createWorkBook(data);
    dialog
      .showSaveDialog({
        filters: [
          {
            name: 'excel',
            extensions: [XLSX_EXTENSION],
          },
        ],
      })
      .then((dialogData) => {
        if (dialogData.filePath) {
          writeDataToExcelFile(xlsData, dialogData.filePath)
            .then(() => shell.openPath(dialogData.filePath ?? ''))
            .catch((err) => console.log(err));
        }
        return null;
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(convertErrorObject(error));
  }
};

module.exports = {
  exportDataToExcel,
}
