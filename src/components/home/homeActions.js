import {
  openPriceModal,
  openProgressModal,
  savePrice,
  setParsedData,
  setParsingProgress,
  startParsingSpinner,
  stopParsingSpinner,
} from './homeSlice';
import { ipcRenderer } from 'electron';

export const importExcelFile = () => (dispatch) => {
  ipcRenderer.on('excel-import-reply', (_event, data) => {
    dispatch(savePrice(data));
    dispatch(openPriceModal());
  });

  ipcRenderer.send('excel-import');
};

export const exportParsedData = () => (
  _dispatch,
  getStore
) => {
  const store = getStore();
  ipcRenderer.send('export-excel', store.home.lastParsedData);
};

export const startParsing = () => (
  dispatch,
  getStore
) => {
  const store = getStore();

  ipcRenderer.on('parsing-progress', (_event, progress) => {
    dispatch(setParsingProgress(Math.round(progress * 100)));
  });

  ipcRenderer.on('parsing-reply', (_event, data) => {
    dispatch(stopParsingSpinner());
    dispatch(setParsedData(data));
  });

  dispatch(startParsingSpinner());
  dispatch(openProgressModal());
  ipcRenderer.send('start-parsing', store.home.price);
};
