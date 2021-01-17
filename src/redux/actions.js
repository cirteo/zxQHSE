/*
     包含n个action creator函数的模块
        同步action：对象{type：‘xxxx’，data:数值}
        异步action：函数 dispatch=> {}
 */
import {
    SET_HEAD_TITLE,
    RECEIVE_USER,
    SHOW_ERR_MSG,
    RESET_USER
    } from './action-types';
import {reqLogin} from "../api";
import storageUtils from "../utils/storageUtils";


// 设置头部标题的同步action
export const setHeadTitle = (headTitle) => ({type: SET_HEAD_TITLE, data: headTitle});

// 接收用户的同步action
export const receiveUser = (user) => ({type: RECEIVE_USER, user});

// 显示错误信息的同步action
export const showErrMsg = (errorMsg) => ({type: SHOW_ERR_MSG, errorMsg});

// 退出登录的同步action
export const logout = () => {
    //清除local中的user
    storageUtils.removeUser();
    // 返回action对象
    return {type: RESET_USER}
};

// 登录的异步action
export const login = (username, password) => {
    return async dispatch => {
        // 1.执行ajax异步1请求
        const result = await reqLogin(username, password);
        const res = result;
        // 2.如果成功，分发成功的同步action
        if (res.status === 0) {
            const user = res.data;
            // 保存到local中
            storageUtils.saveUser(user);
            // 分发action
            dispatch(receiveUser(user))
        } else {
            // 如果失败，分发失败的同步action
            const msg = res.msg;
            dispatch(showErrMsg(msg))
        }
    }
};

