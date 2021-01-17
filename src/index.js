import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider}  from 'react-redux';
import store from "./redux/store";
import 'antd/dist/antd.less';
import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';
/*
入口js
 */

//读取local中保存到user，保存到内存中
const user=storageUtils.getUser();
memoryUtils.user=user;


ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,document.getElementById('root'));

