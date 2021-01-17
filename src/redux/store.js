/*
* redux最核心的管理对象store
* */
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension";
import reducer from './reducer';

// 向外暴露默认的store
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)));
