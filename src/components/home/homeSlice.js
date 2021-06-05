import { createSlice } from '@reduxjs/toolkit';



const initialState = {
  price: [],
  showPriceModal: false,
  showParsingProgress: false,
  parsing: false,
  lastParsedData: [],
  parsingProgress: 0,
};

export const homeSlice = createSlice({
  name: 'homeSlice',
  initialState,
  reducers: {
    savePrice: (state, action) => {
      state.price = action.payload;
    },
    setParsedData: (state, action) => {
      state.lastParsedData = action.payload;
    },
    setParsingProgress: (state, action) => {
      state.parsingProgress = action.payload;
    },
    openPriceModal: (state) => {
      state.showPriceModal = true;
    },
    closePriceModal: (state) => {
      state.showPriceModal = false;
    },
    openProgressModal: (state) => {
      state.showParsingProgress = true;
    },
    closeProgressModal: (state) => {
      state.showParsingProgress = false;
      state.parsingProgress = 0;
    },
    startParsingSpinner: (state) => {
      state.parsing = true;
    },
    stopParsingSpinner: (state) => {
      state.parsing = false;
    },
  },
});

export const {
  savePrice,
  setParsedData,
  setParsingProgress,
  openPriceModal,
  closePriceModal,
  startParsingSpinner,
  stopParsingSpinner,
  openProgressModal,
  closeProgressModal,
} = homeSlice.actions;

export const homeReducer = homeSlice.reducer;
