import _ from 'lodash';
import ActionTypes from '../Actions/ActionTypes';
import TraceCard from '../Component/PartOption/TraceCard';
import axios from 'axios';
import { Message, notification } from 'antd';
import moment from 'moment';

const data = (state = {}, action) => {
    //console.log("进入reduce-data:",action)
    return {
        desc: desc(state.desc, action),
        loadData: loadData(state.loadData, action),
        mappings: mappings(state.mappings, action),
        oneTrackDetail: oneTrackDetail(state.oneTrackDetail, action),
        chartData: chartData(state.chartData, action),
        filterData: filterData(state.filterData, action),
        error: error(state.error, action)
    }
}

const initFilter = () => {
    const date = new Date();
    let nowTime = new Date();
    //nowTime.setMonth(nowTime.getMonth()-1);
    return {
        endTime: moment(nowTime).format('YYYY-MM-DD'),
        startTime: moment(nowTime).add("month",-15).format('YYYY-MM-DD'),
        userNumberStatus:{},
        userNumber: '',
        options: TraceCard.typeOptions,
        radioValue: 'all',
        timeChoose: null,
    };
}


//加载数据是选出相同的MD5和date
function desc(descInState = { sameDay: {}, sameMd5: {}, date_type: { timeDataArray: [], analyseDays: {} }, sumCatg: {} }, action) {
    return {
        sameDay: sameDayFun(descInState.sameDay, action),
        sameMd5: sameMd5Fun(descInState.sameMd5, action),
        date_type: date_type(descInState.date_type, action),
        sumCatg: sumCatgFun(descInState.sumCatg, action),
    };
}

function sameMd5Fun(state, action) {
    const { type } = action;
    const {sameMd5}=action.payload||{};
    switch (type) {
        case ActionTypes.DATA.MD5_COLLECTOR:
        case ActionTypes.DATA.MD5_DELETE:
        case ActionTypes.DATA.DATA_SAMEMD5_REGET:
            return sameMd5;
        default: return state;
    }
}
//同日分析
function sameDayFun(state, action) {
    const { type } = action;
    const {sameDay}=action.payload||{};
    switch (type) {
        case ActionTypes.DATA.DATE_COLLECTOR:
        case ActionTypes.DATA.DATE_DELETE:
        case ActionTypes.DATA.DATA_SAMEDAY_REGET:
            return sameDay;
        default:
            return state;
    }
}

function sumCatgFun(state, action) {
    const { type } = action;
    const {sumCatg}=action.payload||{};
    switch (type) {
        case ActionTypes.DATA.SUMCATG_COLLECTOR:
        case ActionTypes.DATA.SUMCATG_DELETE:
        case ActionTypes.FILTER.RADIO_CHANGE:
        case ActionTypes.DATA.DATA_SUMCATG_REGET:
            return sumCatg;
        default:
            return state;
    }
}

//data_type={身份证:时间数据,timeDataArray:时间轴}
function date_type(state, action) {
    const { type, } = action;
    const {userNumber, userTimeTypeDataArr, timeDataArray, analyseDays,userDateTypeMap }=action.payload||{};
    switch (type) {
        case ActionTypes.DATA.DATE_TYPE_COLLECTOR:
            return Object.assign(state, { [userNumber]: userTimeTypeDataArr }, { timeDataArray, analyseDays });
        case ActionTypes.DATA.DATE_TYPE_DELETE:
            const stateClone = _.cloneDeep(state);
            delete stateClone[userNumber];
            return Object.assign(stateClone, { timeDataArray, analyseDays });
        case ActionTypes.OPTION.CHANGE_CHECK:
        case ActionTypes.FILTER.RADIO_CHANGE:
            return Object.assign({}, state, { timeDataArray, analyseDays });
        case ActionTypes.DATA.DATA_DATETYPE_REGET:
            //const {  } = action;//userDateTypeMap为 身份证：时间类型数组
            return Object.assign({}, state, userDateTypeMap, { timeDataArray, analyseDays })
        default: return state;
    }
}

//加载原始数据state
function loadData(loadDataInState = {}, action) {
    const loadDataClone = _.cloneDeep(loadDataInState);
    const {type}=action;
    const {userData,userNumber,personDataList}=action.payload||{};
    switch (type) {
        case ActionTypes.DATA.ADD_RECEIVE:
            loadDataClone[userNumber] = userData;
            return loadDataClone;//由ajax添加数据值resource
        case ActionTypes.DATA.DATA_DELETE:
            delete loadDataClone[userNumber];
            return loadDataClone;
        case ActionTypes.DATA.DATA_REGET:
            //重新检索数据
            personDataList.map(personData => {
                if(personData.people){
                    loadDataClone[personData.people.userNumber] = personData;
                }
            })
            return loadDataClone;
        default:
            return loadDataInState;
    }
}

//加载数据时做映射
function mappings(mappingsInState = {}, action) {
    const { type,  } = action;
    const {userNumber, userDateMap,userMappingMap}=action.payload||{};
    switch (type) {
        case ActionTypes.DATA.MAPPING:
            return Object.assign({}, mappingsInState, { [userNumber]: userDateMap });
        case ActionTypes.DATA.DELETE_MAPPING:
            const clone = _.cloneDeep(mappingsInState);
            delete clone[userNumber];
            return clone;
        case ActionTypes.DATA.DATA_MAPPING_REGET:
            return userMappingMap;
        default:
            return mappingsInState;
    }
}

function oneTrackDetail(state = {}, action) {
    const {type}=action;
    const {detailData}=action.payload||{};
    switch (type) {
        case ActionTypes.DATA.LOAD_ONETRACK_DETAIL:
            return Object.assign({}, state, detailData);
        default:
            return state;
    }
}

function chartData(chartDataInState = {}, action) {
    const {type}=action;
    const { userDateArr, userNumber } =action.payload||{};
    switch (type) {
        case ActionTypes.CHART.CHART_ADD_DATA:
            return chartDataInState;
        case ActionTypes.CHART.CHART_DELETE_DATA:
            delete chartDataInState[userNumber];
            return chartDataInState;
        default:
            return chartDataInState;
    }
}

//--------------顶部删选--------------------
const filterData = (filterInState = initFilter(), action) => {
    const {type}=action;
    const {startTime,endTime,userNumber,radioValue,timeChoose,userNumberStatus,optValue,optCheck}=action.payload||{};
    switch (type) {
        case ActionTypes.FILTER.SET_START_TIME:
            return Object.assign({}, filterInState, { startTime: action.startTime });
        case ActionTypes.FILTER.SET_END_TIME:
            return Object.assign({}, filterInState, { endTime: action.endTime });
        case ActionTypes.FILTER.SET_USERNUMBER:
            return Object.assign({}, filterInState, { userNumber: action.userNumber });
        case ActionTypes.OPTION.CHANGE_CHECK:
            const { options } = filterInState;
            const optionsClone=_.cloneDeep(options);
            optionsClone.map((item) => {
                if (optValue === item.value) {
                    item.ischeck = optCheck;
                }
            });
            return Object.assign({}, filterInState, { options:optionsClone });
        case ActionTypes.FILTER.RADIO_CHANGE:
            return Object.assign({}, filterInState, { radioValue });
        case ActionTypes.DATA.CHANGE_TIME_SELECT:
            return Object.assign({}, filterInState, { timeChoose });
        case ActionTypes.DATA.ADD_USER_ARRAY_INPUT:
            return Object.assign({},filterInState,{userNumberStatus});
        case ActionTypes.DATA.DEL_USER_INPUT:
            return Object.assign({},filterInState,{userNumberStatus});
        default:
            return filterInState;
    }
}

function error(errorInState = {}, action) {
    const { type,  } = action;
    const {errorMsg,notifyDesc, notifyMsg }=action.payload||{};
    switch (type) {
        case ActionTypes.DATA.ERROR_MSG: Message.error(errorMsg); return;
        case ActionTypes.DATA.NOTIFY_MSG:
            notification["warning"]({
                message: notifyMsg,
                description: notifyDesc,
            });
            return;
    }
}
export default data;

