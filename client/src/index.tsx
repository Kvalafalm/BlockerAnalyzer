import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider } from 'notistack';
import { store } from "./store"
import { Provider } from 'react-redux';

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3}
      autoHideDuration={9000}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}>
      <Provider store={store}>
        <App />
      </Provider>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
