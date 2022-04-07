import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { reduxStore } from './redux/redux-store';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <Provider store={reduxStore}>
      <App />
    </Provider>
  </>
);

reportWebVitals();
