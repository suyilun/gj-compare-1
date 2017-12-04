import ActionTypes from '../Actions/ActionTypes';
import { notification } from 'antd';

const ui = (state = initUI, action) => {
    //console.log("进入reduce-UI:",state)
    return {
        Top: changeTop(state.Top, action),
        Detail: changeDetail(state.Detail, action),
        isLoad: changeLoadStatus(state.isLoad, action),
        traceWidth: initUI.traceWidth,//窗口宽度
        notLogin:changeLogin(state.notLogin,action),
        showChart: function (showChartInState, action) {
            switch (action.type) {
                case ActionTypes.UI.CHANGE_SHOW_CHART:
                    return action.showChart;
                default: return showChartInState;
            }
        }(state.showChart, action)
    }
}
/*
初始化开始
 */
const initUI = {
    Top: { showTop: true },
    Detail: { showDetsil: false },
    isLoad: { isLoadStatus: false },
    traceWidth: window.screen.availWidth - 110,
    scrollerWidth: 0,
    showChart: false,
    notLogin:false,
}

function changeLogin(notLoginInstate,action){
    const {type,payload}=action;
    const {notLogin}=payload||{};
    switch(type){
        case ActionTypes.DATA.NOT_LOGIN:
            console.log("-----11111111-----",notLogin)
            if(notLogin){
                notification.error({
                    duration:null,
                    message: '访问错误',
                    description:<b>用户登录失效，请点击<a href={`${__ENV__.loginPath}`}>链接</a>跳转登录界面!</b>
                })
            }
            return {notLogin};
        default: return notLoginInstate;
    }
}


/*
 初始化结束
 */
function changeTop(state, action) {
    //console.log("changeUI",action);
    switch (action.type) {
        case ActionTypes.UI.TOPSHOW:
            return Object.assign({}, state, { showTop: !action.isShow });
        default:
            return state;
    }
}

function changeDetail(state, action) {
    //console.log("changeDetail",action);
    switch (action.type) {
        case ActionTypes.UI.DETAILSHOW:
            return Object.assign({}, state, { showDetail: action.isShow });
        default:
            return state;
    }
}


function changeLoadStatus(state, action) {
    //console.log("chngeLoad",action);
    switch (action.type) {
        case ActionTypes.UI.LOADWAIT:
            const {loadStatus}=action.payload
            return Object.assign({}, state, { isLoadStatus: loadStatus })
        default:
            return state
    }
}



export default ui