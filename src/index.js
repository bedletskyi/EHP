/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import "semantic-ui-css/semantic.css";
import React from 'react';
import Home from './components/home/Home.jsx';
import { Provider } from 'react-redux';
import { store } from './store';
import {render} from "react-dom";

let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)

render(
  <Provider store={store}>
    <Home />
  </Provider>,
  document.getElementById('root'),
);
