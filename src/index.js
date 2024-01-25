import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import configstore from './store/store';
import { Provider } from 'react-redux';

import {getStartUser} from "./Actions/userAction"
import { getStartWallet } from './Actions/walletAction';


const root = ReactDOM.createRoot(document.getElementById('root'));

const store = configstore()
console.log(store)

if(localStorage.getItem('token')){
    store.dispatch(getStartUser())
    store.dispatch(getStartWallet())
}

store.subscribe(()=>{
    console.log(store.getState(),"getStartUser")
})


root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
reportWebVitals();
