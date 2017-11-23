import ActionTypes from './ActionTypes'
import {Map} from 'immutable'
import TraceCard from '../Component/PartOption/TraceCard'
import axios from 'axios'
import _ from 'lodash';
import {batchActions, enableBatching} from 'redux-batched-actions';
import {createAction} from 'redux-actions';
// import {createAction} from 'redux-actions'; import {
// getScaleFnFromScaleObject } from 'react-vis/dist/utils/scales-utils';

/*以下为 Top 内容*/
//UI是否显示Top
export function showTop(isShow) {
    return {type: ActionTypes.UI.TOPSHOW, isShow: isShow}
}
//添加选项（飞机，火车）
export function addOption(optionName, optionClass) {
    return {type: ActionTypes.OPTION.ADD, optionName: optionName, optionClass: optionClass};
}


const loadWatiAct=createAction(ActionTypes.UI.LOADWAIT, () => { return {loadStatus: true}});
const loadWaitFalseAct = createAction(ActionTypes.UI.LOADWAIT, () => { return {loadStatus : false}});

//改变选项（飞机，火车）选中状态
export function checkOption(optValue, optCheck) {
  
    return (dispatch, getState) => {
        const radioValue = getState().data.filterData.radioValue;
        const timeDataArray = calculteTimeDataArrayByChangeOptionAndRadio(getState, optValue, optCheck, radioValue);
        const sameMd5 = getState().data.desc.sameMd5; //{md5{timer:1}}对象
        const sameDay = getState().data.desc.sameDay; //{day:{timer:1}}对象
        const userNumberSize = Object
            .keys(getState().data.loadData)
            .length;
        const analyseDays = calculteAnalyseDays(sameDay, sameMd5, userNumberSize, timeDataArray);
    
        const checkOptionByAct = createAction(ActionTypes.OPTION.CHANGE_CHECK, () => {
           return {optValue, optCheck, timeDataArray, analyseDays} 
        })
        dispatch(
            batchActions(
                [
                    checkOptionByAct(),
                ],
            'batch_checkOption'
            )
        )
       
    }
}

//设置筛选结束日期
export function setEndTime(endTime) {
    return {type: ActionTypes.FILTER.SET_END_TIME, endTime};
}

//设置筛选开始日期
export function setStartTime(startTime) {
    return {type: ActionTypes.FILTER.SET_START_TIME, startTime};
}

/*以下为content 内容*/

//UI是否显示Top
export function isLoadWait(loadStatus) {
    return {type: ActionTypes.UI.LOADWAIT, loadStatus}
}
function mapping(userNumber, userDateMap) {
    return {type: ActionTypes.DATA.MAPPING, userNumber, userDateMap}
}

function descSameDay(getState, userTimeTypeDataArr) {
    const sameDay = calculteSameDay(getState, userTimeTypeDataArr);
    return {type: ActionTypes.DATA.DATE_DELETE, sameDay}
}

function descSameMd5(getState, userTimeTypeDataArr) {
    const sameMd5 = calculteSameMd5(getState, userTimeTypeDataArr);
    return {type: ActionTypes.DATA.MD5_COLLECTOR, sameMd5}
}

function timeArrayToTimeDataArray(allTimes) {
    //console.log("allTimes",allTimes)
    const daySortArray = allTimes.sort(function (a, b) {
        return b - a;
    });
    let nextTime;
    let nextMonth;
    let dayData = [];
    const timeDataArray = [];
    daySortArray.map((time, index) => {
        var timeStr = String(time);
        // console.log(index,time);
        if (nextTime == undefined || nextTime.substr(0, 8) != timeStr.substr(0, 8)) { //判断是不是新的一天或最后一天
            // let dayData = oneDay;
            nextTime = timeStr.substr(0, 8);
            nextMonth = timeStr.substr(0, 6);
            dayData = [];
            timeDataArray.push({month: nextMonth, day: nextTime, dayData: dayData})
        }
        //过滤type
        if (dayData.indexOf(time) == -1) {
            dayData.push(time);
        }

    })
    return timeDataArray;
}

//栏目过滤选中,radio切换
const calculteTimeDataArrayByChangeOptionAndRadio = (getState, optValue, optCheck, radioValue) => {
    const dateType = getState().data.desc.date_type;
    const sameMd5 = getState().data.desc.sameMd5; //{md5{timer:1}}对象
    const sameDay = getState().data.desc.sameDay; //{day:{timer:1}}对象
    const filterData = getState().data.filterData;
    const allTimes = [];
    const showTypes = filterData
        .options
        .filter((option) => {
            return option.ischeck
        })
        .map((option) => {
            return option.value
        });
    if (optCheck) {
        showTypes.push(optValue);
    } else {
        _
            .remove(showTypes, function (n) {
                return n == optValue;
            })
    }
    const userNumbersInState = Object
        .keys(dateType)
        .filter(item => {
            return !(item == 'timeDataArray' || item == 'analyseDays')
        });
    userNumbersInState.map(userNumberKey => {
        const timeTypeDataArrInState = dateType[userNumberKey];
        timeTypeDataArrInState.map(timeTypeData => {
            //没有过滤操作
            if (showTypes.indexOf(timeTypeData.catg) != -1) {
                if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5, userNumbersInState.length)) {
                    allTimes.push(timeTypeData.time);
                }
            }
        })
    });
    return timeArrayToTimeDataArray(allTimes);

}

const filterByRadio = (radioValue, dayValue, md5Value, sameDay, sameMd5, userNumberSize) => {
    // console.log("md5Value, ", md5Value);
    switch (radioValue) {
        case "all":
            return true;
        case "sameDay":
            if (typeof sameDay[dayValue] == 'undefined') {
                return false;
            }
            return sameDay[dayValue] > 1;
        case "sameTwo":
            let sameTwo = typeof sameMd5[md5Value] != 'undefined';
            return sameTwo
                ? sameMd5[md5Value].count > 1
                : false;
        case "sameAll":
            //所有相同
            if (userNumberSize == 1) {
                return false;
            }
            return typeof sameMd5[md5Value] != 'undefined'
                ? sameMd5[md5Value].count == userNumberSize
                : false;
        default:
            console.error("radio值有错误", radioValue);
    }
}

const calculteAnalyseDays = (sameDay, sameMd5, userSize, timeDataArray) => {
    const analyseDays = {}
    const allShowDay = {};
    Object
        .keys(sameDay)
        .map(dayInSameDay => {
            if (sameDay[dayInSameDay] == 1) {
                //有轨迹为1
                analyseDays[dayInSameDay] = 1;
            } else {
                //相同为2
                analyseDays[dayInSameDay] = 2;
            }
        })
    if (userSize != 1) {
        Object
            .keys(sameMd5)
            .filter(md5 => {
                //md5
                const item = sameMd5[md5];
                if (item.count == 1) {}
                if (item.count > 1 && item.count < userSize) {
                    //两两相同为3
                    analyseDays[item.day] = 3;
                }
                if (item.count == userSize) {
                    //完全相同为4
                    analyseDays[item.day] = 4;
                }
                if (!item.count) {
                    console.error("md5计算时间格子有异常", item)
                }
            });
    }
    if (timeDataArray) {
        timeDataArray.map(timeDataItem => {
            allShowDay[timeDataItem.day] = 1;
        });
        const dayKeys = Object.keys(analyseDays);
        dayKeys.map(dayKey => {
            if (!allShowDay[dayKey]) {
                delete analyseDays[dayKey];
            }
        });
    }
    //判断日期是否在timeDataArray中
    return analyseDays;
}





//用户添加删除
const calculteTimeDataArrayByUserChange = (getState, userNumber, userTimeTypeDataArr, isDeleteUser = false) => {
    const dateType = getState().data.desc.date_type;
    const filterData = getState().data.filterData;
    const radioValue = filterData.radioValue;
    //加入 radioValue属性
    const showTypes = filterData
        .options
        .filter((option) => {
            return option.ischeck
        })
        .map((option) => {
            return option.value
        });
    //重新计算sameDay
    const sameDay = calculteSameDay(getState, isDeleteUser
        ? dateType[userNumber]
        : userTimeTypeDataArr, isDeleteUser);
    //计算相同md5日
    const sameMd5 = calculteSameMd5(getState, isDeleteUser
        ? dateType[userNumber]
        : userTimeTypeDataArr, isDeleteUser);
    const userNumbersInState = Object
        .keys(dateType)
        .filter(item => {
            return !(item == 'timeDataArray' || item == 'analyseDays')
        });
    //对比的人数
    let userSize = isDeleteUser
        ? userNumbersInState.length - 1
        : userNumbersInState.length + 1;
    //分析所有的日期情况
    const allTimeTypeData = [];
    userNumbersInState.map(userNumberKey => {
        if (userNumber != userNumberKey) {
            const userTimeTypeDataArrInState = dateType[userNumberKey];
            userTimeTypeDataArrInState.map(timeTypeData => {
                //没有过滤操作
                if (showTypes.indexOf(timeTypeData.catg) != -1) {
                    allTimeTypeData.push(timeTypeData)
                }
            })
        }
        //{time,catg,show,sameKey}
    });

    userTimeTypeDataArr.map(timeTypeData => {
        if (showTypes.indexOf(timeTypeData.catg) != -1) {
            allTimeTypeData.push(timeTypeData);
        }
    });

    const allTimes = allTimeTypeData.filter((timeTypeData) => {
        return (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5, userSize));
    }).map((itemTypeData) => {
        return itemTypeData.time;
    });
    const timeDataArray = timeArrayToTimeDataArray(allTimes);
    const analyseDays = calculteAnalyseDays(sameDay, sameMd5, userSize, timeDataArray);
    return {timeDataArray, analyseDays};
}

//计算同一天
const calculteSameDay = (getState, userTimeTypeDataArr, isDeleteUser = false) => {
    const sameDay = _.cloneDeep(getState().data.desc.sameDay);
    const allDays = Object.keys(sameDay);
    const hasDoDay = {}; //已经操作过日期
    if (!isDeleteUser) {
        //新增用户
        userTimeTypeDataArr.map(timeTypeData => {
            //按照天统计
            const day = timeTypeData.day;
            if (!hasDoDay[day]) {
                if (allDays.indexOf(day) != -1) {
                    //有数据
                    sameDay[day] = sameDay[day] + 1;
                } else {
                    //无数据
                    sameDay[day] = 1
                }
                hasDoDay[day] = 1;
            }
        });
    } else {
        // 删除用户时 const dateType = getState().data.desc.date_type; userTimeTypeDataArr =
        // dateType[userNumber];
        userTimeTypeDataArr.map(timeTypeData => {
            const day = timeTypeData.day;
            if (!hasDoDay[day]) {
                if (allDays.indexOf(day) != -1) {
                    if (sameDay[day] == 1) {
                        delete sameDay[day];
                    } else {
                        if (sameDay[day]) {
                            sameDay[day] = sameDay[day] - 1;
                        }
                    }
                    hasDoDay[day] = 1;
                } else {
                    console.error("state.desc.sameDay中不存在日期为：" + day + "数据");
                }
            }
        })
    }
    if (userTimeTypeDataArr.length == 0) {
        return {}
    }
    return sameDay;
}

//计算统一个md5
const calculteSameMd5 = (getState, userTimeTypeDataArr, isDeleteUser = false) => {
    const sameMd5 = _.cloneDeep(getState().data.desc.sameMd5);
    //md5;
    if (!isDeleteUser) {
        //新增用户
        userTimeTypeDataArr.map(timeTypeData => {
            if (typeof sameMd5[timeTypeData.md5] == "undefined") {
                sameMd5[timeTypeData.md5] = {
                    count: 1,
                    day: timeTypeData.day
                };
            } else {
                sameMd5[timeTypeData.md5].count = sameMd5[timeTypeData.md5].count + 1;
            }
        })
    } else {
        // 删除时 const dateType = getState().data.desc.date_type; userTimeTypeDataArr =
        // dateType[userNumber];
        userTimeTypeDataArr.map(timeTypeData => {
            if (typeof sameMd5[timeTypeData.md5] == "undefined") {
                console.log("md5 键不存在" + timeTypeData.md5);
            } else {
                if (sameMd5[timeTypeData.md5].count == 1) {
                    delete sameMd5[timeTypeData.md5];
                } else {
                    sameMd5[timeTypeData.md5].count = sameMd5[timeTypeData.md5].count - 1;
                }
            }
        })
    }
    if (isDeleteUser && userTimeTypeDataArr.length == 0) {
        return {};
    }
    return sameMd5;
}

const calculteCatgSum = (getState,userNumberDel) => {
    const loadData = getState().data.loadData;
    const userNumbers = Object.keys(loadData);
    const filterData = getState().data.filterData;
    const timeDataArray = getState().data.desc.date_type.timeDataArray;
    const showTypes = filterData
        .options
        .filter((option) => {
            return option.ischeck
        })
        .map((option) => {
            return option.value
        });
    const catgSum = {};
    const allDays = timeDataArray.map(timeDataItem => {
        return timeDataItem.day;
    })

    userNumbers.map(userNumber => {
        if(!(userNumberDel!=undefined&& userNumberDel==userNumber)){
            loadData[userNumber]
            .content
            .map((trace) => {
                let traceDay = String(trace.traceTime).substr(0, 8);
                if (allDays.indexOf(traceDay) != -1 && showTypes.indexOf(trace.catg) != -1) {
                    if (typeof catgSum[trace.catg] == 'undefined') {
                        catgSum[trace.catg] = 0;
                    }
                    catgSum[trace.catg] = catgSum[trace.catg] + 1;
                }
            })  
        }
      
    });
    return catgSum;
    // const sumCatg = _.cloneDeep(getState().data.desc.sumCatg); const radioValue =
    // getState().data.filterData.radioValue; const dateType =
    // getState().data.desc.date_type; const sameDay = isDeleteUser ?
    // getState().data.desc.sameDay : calculteSameDay(getState, userTimeTypeDataArr,
    // isDeleteUser); const sameMd5 = isDeleteUser ? getState().data.desc.sameMd5 :
    // calculteSameMd5(getState, userTimeTypeDataArr, isDeleteUser); const
    // userNumbersInState = Object.keys(dateType).filter(item => { return !(item ==
    // 'timeDataArray' || item == 'analyseDays') }); if (!isDeleteUser) {     //新增用户
    //     userTimeTypeDataArr.map(timeTypeData => {         if
    // (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay,
    // sameMd5, userNumbersInState.length + 1)) {             if (typeof
    // sumCatg[timeTypeData.catg] == 'undefined') {
    // sumCatg[timeTypeData.catg] = 1;             } else {
    // sumCatg[timeTypeData.catg] = sumCatg[timeTypeData.catg] + 1;             }
    //      }     }) } else {     userTimeTypeDataArr.map(timeTypeData => {
    // if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay,
    // sameMd5, userNumbersInState.length)) {
    // console.log("calculteCatgSum 删除 "+timeTypeData)             if (typeof
    // sumCatg[timeTypeData.catg] == 'undefined') {
    // sumCatg[timeTypeData.catg] = 0;             } else {
    // sumCatg[timeTypeData.catg] = sumCatg[timeTypeData.catg] - 1;             }
    //      }     }) } if (isDeleteUser && userTimeTypeDataArr.length == 0) {
    // return {}; } return sumCatg;
}

const calculteCatgSumRadioChange = (getState, radioValue) => {
    //const sumCatg = _.cloneDeep(getState().data.desc.sumCatg);
    const dateType = getState().data.desc.date_type;
    const sameMd5 = getState().data.desc.sameMd5; //{md5{timer:1}}对象
    const sameDay = getState().data.desc.sameDay; //{day:{timer:1}}对象
    //const filterData = getState().data.filterData;
    const sumCatg = {};
    const userNumbersInState = Object
        .keys(dateType)
        .filter(item => {
            return !(item == 'timeDataArray' || item == 'analyseDays')
        });
    userNumbersInState.map(userNumberKey => {
        const timeTypeDataArrInState = dateType[userNumberKey];
        timeTypeDataArrInState.map(timeTypeData => {
            if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5, userNumbersInState.length)) {
                if (typeof sumCatg[timeTypeData.catg] == 'undefined') {
                    sumCatg[timeTypeData.catg] = 1;
                } else {
                    sumCatg[timeTypeData.catg] = sumCatg[timeTypeData.catg] + 1;
                }
            }
        })
    })
    return sumCatg;
}

function descSumCatg(getState, timeTypeDataArr) {
    const sumCatg = calculteCatgSum(getState);
    return {type: ActionTypes.DATA.SUMCATG_COLLECTOR, sumCatg}
}


function descDateTypeArr(getState, userNumber, userTimeTypeDataArr) {
    const {timeDataArray, analyseDays} = calculteTimeDataArrayByUserChange(getState, userNumber, userTimeTypeDataArr);
    return {type: ActionTypes.DATA.DATE_TYPE_COLLECTOR, userNumber, userTimeTypeDataArr, timeDataArray, analyseDays}
}



function AddData(userNumber, userData) {
    return {type: ActionTypes.DATA.ADD_RECEIVE, userNumber, userData}
}

function iscontain(sfzh, mappings) {
    for (var key in mappings) {
        if (key == sfzh) {
            return true;
        }
    }
    return false;
}

//加载一个人的数据 thunk action 创建函数 虽然内部操作不同，但是你可以像创建action创建函数一样使用它，且内部可dispatch
export function loadData(sfzh) {
    //thunk middleware 知道如何处理函数 这里把 dispatch 方法通过参数的形式传给函数以此来让它自己也能dispatch action
    return function (dispatch, getState) {
        // console.log(getState());//获取state getState是function 而getstate() 的结果是state let
        // sfzh=getState().filter.timeAndNumber.userNumber;
        if (sfzh.length != 18) {
            dispatch(errorMsg("请输入18位身份证号."));
            return;
        } else if (iscontain(sfzh, getState().data.mappings)) {
            dispatch(errorMsg("对不起该身份证已存在"));
            return;
        }
        //首次displaced：更新loadStatus 来加载进度条
        dispatch(isLoadWait(true));
        //TODO:旧请求地址 /json/${sfzh}.json /fwzy/do/track/data `/fwzy/do/track/data`
        return axios.get(`/fwzy/do/track/data`, {
            params: {
                zjhm: sfzh,
                kssj: getState()
                    .data
                    .filterData
                    .startTime
                    .replace("-", "")
                    .replace("-", "") + "000000",
                jssj: String(getState().data.filterData.endTime)
                    .replace("-", "")
                    .replace("-", "") + "999999",
                lx: getState()
                    .data
                    .filterData
                    .options
                    .map((option) => {
                        return option.value
                    })
                    .join(","), //'wb,lg,hc,ky,fj,zk,qt,yl'
            },
                responseType: "json"
            })
            .then(function (response) {
                let userData = response.data;
                if (Object.keys(userData).length == 0) {
                    dispatch(notifyMsg("查找失败", `无此身份证${sfzh}档案，轨迹数据`))
                } else {
                    let userNumber = userData.people.userNumber;
                    let userTraces = userData.content;
                    let userMd5Arr = [];
                    let userDateMap = {};
                    let userTimeTypeDataArr = [];
                    // let userDateArr = []; 用户时间类型数据 let userTimeTypeData = { userNumber:
                    // userNumber, timeTypeData: [] };
                    userTraces.map((trace, index) => {
                        //userDateArr.push(trace.traceTime); 如果是旅馆，需要进行拆分
                        userMd5Arr.push(TraceCard.sameKeyGen(trace));
                        //index-show  序号-是否显示
                        userDateMap[trace.traceTime] = {
                            index: index
                        };
                        if (!trace.md5) {
                            trace.md5 = TraceCard.sameKeyGen(trace); //生成MD5
                        }
                        //类型-时间-是否显示catg,time,show,sameKey,key判断是是否相同值
                        userTimeTypeDataArr.push({
                            time: trace.traceTime,
                            day: String(trace.traceTime).substr(0, 8),
                            catg: trace.catg,
                            md5: trace.md5
                        })
                    });
                    //时间轴
                    dispatch(descDateTypeArr(getState, userNumber, userTimeTypeDataArr));

                    //数据映射
                    dispatch(mapping(userNumber, userDateMap));
                    //同日
                    dispatch(descSameDay(getState, userTimeTypeDataArr));
                    //同md5
                    dispatch(descSameMd5(getState, userTimeTypeDataArr));
                    //数据存储
                    dispatch(AddData(userNumber, userData));
                    //合计
                    dispatch(descSumCatg(getState)); //需要在descSameDay，descSameDay之前实现
                }
                // 图标数据 dispatch(     {         type: ActionTypes.CHART.CHART_ADD_DATA,
                // userNumber,         userDateArr     }); 停止显示进度条
                dispatch(isLoadWait(false));
                console.log("更新后的state:", getState());
            })
            .catch(function (error) {
                console.error(error);
                dispatch(isLoadWait(false));
                dispatch(errorMsg(error.message));
            });
    }
}


export function changeChart() {
    return (dispatch, getState) => {
        const chartData = {}
        return {type: ActionTypes.CHART.CHART_INIT, chartData}
    }
}

export function changeShowChart(value) {
    return {type: ActionTypes.UI.CHANGE_SHOW_CHART, showChart: value}
}

//删除一个人的轨迹内容
export function dataCancel(userNumber) {
    return function (dispatch, getState) {
        const dateType = getState().data.desc.date_type;
        // const md5Arr = date_type[userNumber].map((item) => { return item.md5 });
        // const dateArr = date_type[userNumber].map((item) => { return item.time });
        const userTimeTypeDataArr = dateType[userNumber];
        //时间轴处理
        const deleteDescDateTypeArrAct=deleteDescDateTypeArr(getState,userNumber);
        const deleteUserInputAct=deleteUserInput(getState,userNumber);
        //dispatch(deleteDescDateTypeArr(getState, userNumber));
        //删除mapping
        const deleteMappingAct=deleteMapping(userNumber);
        //dispatch(deleteMapping(userNumber));
        const deleteDescSameDayAct=deleteDescSameDay(getState, userTimeTypeDataArr);
        //dispatch(deleteDescSameDay(getState, userTimeTypeDataArr));
        const deleteDescSameMd5Act=deleteDescSameMd5(getState, userTimeTypeDataArr);
        //dispatch(deleteDescSameMd5(getState, userTimeTypeDataArr));
        //dispatch(deleteMapping(userNumber)); 删除数据

        const deleteDataAct=deleteData(userNumber);
        //dispatch(deleteData(userNumber));
        const deleteDescSumCatgAct=deleteDescSumCatg(getState,userNumber)
        //dispatch(deleteDescSumCatg(getState));
        // dispatch({ type: ActionTypes.CHART.CHART_DELETE_DATA, userNumber })

        dispatch(batchActions([
            deleteUserInputAct(),
            deleteDescDateTypeArrAct(),
            deleteMappingAct(),
            deleteDescSameDayAct(),
            deleteDescSameMd5Act(),
            deleteDataAct(),
            deleteDescSumCatgAct(),
        ],'batch_dataCancel'))
        
        // console.log("更新后的state:", getState());
    }
}

function deleteUserInput(getState,userNumber){
    const { userNumberArray , userNumberStatus}=getState().data.filterData;
    let userIndex=userNumberArray.indexOf(userNumber);
    return  createAction(ActionTypes.DATA.DEL_USER_INPUT,
        ()=>{
            return {
                userNumberArray:userNumberArray.filter((item,idx)=>{
                    return idx!=userIndex;
                }),
                userNumberStatus:userNumberStatus.filter((item,idx)=>{
                    return idx!=userIndex;
                })
            }
        });
}

function deleteDescDateTypeArr(getState, userNumber) {
    const {timeDataArray, analyseDays} = calculteTimeDataArrayByUserChange(getState, userNumber, [], true);
    return createAction( ActionTypes.DATA.DATE_TYPE_DELETE, ()=>{return {userNumber, timeDataArray, analyseDays}});
}

function deleteDescSumCatg(getState,userNumber) {
    const sumCatg = calculteCatgSum(getState,userNumber);
    console.log(sumCatg)

    return createAction( ActionTypes.DATA.SUMCATG_DELETE, ()=>{return {sumCatg}});
    //return {type: ActionTypes.DATA.SUMCATG_DELETE, sumCatg}
}

function deleteMapping(userNumber) {
    return createAction(  ActionTypes.DATA.DELETE_MAPPING, ()=>{return {userNumber}});
}
function deleteData(userNumber) {
    return createAction(  ActionTypes.DATA.DATA_DELETE, ()=>{return {userNumber}});
}

function deleteDescSameDay(getState, userTimeTypeDataArr) {
    const sameDay = calculteSameDay(getState, userTimeTypeDataArr, true);
    return createAction(ActionTypes.DATA.DATE_DELETE,()=>{return {sameDay};});
    //return {type: ActionTypes.DATA.DATE_DELETE, sameDay}
}

function deleteDescSameMd5(getState, userTimeTypeDataArr) {
    const sameMd5 = calculteSameMd5(getState, userTimeTypeDataArr, true);
    return createAction(ActionTypes.DATA.MD5_DELETE,()=>{return {sameMd5};});
   // return {type: ActionTypes.DATA.MD5_DELETE, sameMd5}
}
//详情是否显示
export function showDetail(isShow) {
    return {type: ActionTypes.UI.DETAILSHOW, isShow: isShow}
}

function loadDetailData(data) {
    return {type: ActionTypes.DATA.LOAD_ONETRACK_DETAIL, detailData: data}
}

//加载详情
export function loadDetail(hbaseKey) {
    console.log("详情加载ajax....");
    console.log(hbaseKey);
    return false;
    return function (dispatch, getState) {
        // console.log(getState());//获取state getState是function 而getstate() 的结果是state
        // 首次displaced：更新loadStatus 来加载进度条
        return axios
            .get('/json/test.json', {responseType: "json"})
            .then(function (response) {
                console.log("异步获得的数据", response.data);
                //详情数据存储
                dispatch(loadDetailData(response.data))
                //显示详情页面
                dispatch(showDetail(true))
            })
            .catch(function (error) {
                dispatch(isLoadWait(false));
                console.log(error);
            });
    }
}

export function changeSameRadio(radioValue) {
    return (dispatch, getState) => {
        const timeDataArray = calculteTimeDataArrayByChangeOptionAndRadio(getState, undefined, undefined, radioValue);
        const sameMd5 = getState().data.desc.sameMd5;
        const sameDay = getState().data.desc.sameDay;
        const sumCatg = calculteCatgSumRadioChange(getState, radioValue);
        const loadData = getState().data.loadData;
        const userNumberSize = Object
            .keys(loadData)
            .length;
        const analyseDays = calculteAnalyseDays(sameDay, sameMd5, userNumberSize, timeDataArray);
        const changeSameRadioAct=createAction(
            ActionTypes.FILTER.RADIO_CHANGE,
            ()=>{
                return {radioValue, timeDataArray, analyseDays, sumCatg};
            }
        )
        return dispatch(batchActions(
            [changeSameRadioAct()],"batch_changeSameRadio",
        ))
    }
}

export function changeTimeSelect(timeChoose) {
    return (dispatch, getState) => {
        return dispatch({type: ActionTypes.DATA.CHANGE_TIME_SELECT, timeChoose});
    }
}

export function scrollerTimeLine(scrollWidth) {
    return (dispatch, getState) => {
        const timeDataArray = getState().data.desc.date_type.timeDataArray;
        //根据滚动轴计算
        return dispatch({type: ActionTypes.UI.SCROLLER_TIME_LINE, scrollWidth})
    }
}

//重新获取人物轨迹数据
export function reGetTraces() {
    return (dispatch, getState) => {
        const loadData = getState().data.loadData;
        const userNumbers = Object.keys(loadData);
        // if (userNumbers.length == 0) {     dispatch(errorMsg("当前没有需要被搜证件号码！"));
        // return; }
        //TODO:旧请求地址/fwzy/do/track/dataList /json/test.json
        dispatch(isLoadWait(true));
        return axios.get(`/fwzy/do/track/dataList`, {
            params: {
                zjhms: userNumbers.join(","),
                kssj: getState()
                    .data
                    .filterData
                    .startTime
                    .replace("-", "")
                    .replace("-", "") + "000000",
                jssj: getState()
                    .data
                    .filterData
                    .endTime
                    .replace("-", "")
                    .replace("-", "") + "999999",
                lx: getState()
                    .data
                    .filterData
                    .options
                    .map((option) => {
                        return option.value
                    })
                    .join(","), //'wb,lg,hc,ky,fj,zk,qt,yl'
            },
                responseType: "json"
            })
            .then(function (response) {
                const personDataList = response.data;
                const userDateTypeMap = {};
                const userMappingMap = {};
                personDataList.map(personData => {
                    const userTimeTypeDataArr = [];
                    const userMapping = {};
                    personData
                        .content
                        .map((trace, index) => {
                            if (!trace.md5) {
                                trace.md5 = TraceCard.sameKeyGen(trace); //生成MD5
                            }
                            userTimeTypeDataArr.push({
                                time: trace.traceTime,
                                day: String(trace.traceTime).substr(0, 8),
                                catg: trace.catg,
                                md5: trace.md5
                            });
                            userMapping[trace.traceTime] = {
                                index: index
                            };
                        })
                    userDateTypeMap[personData.people.userNumber] = userTimeTypeDataArr;
                    userMappingMap[personData.people.userNumber] = userMapping;
                })

                //分析 同一天数据
                const sameDay = calculteSameDayByReget(userDateTypeMap);
                const sameMd5 = calculteSameMd5ByReget(userDateTypeMap);

                dispatch(regetDescSameDay(sameDay));
                dispatch(regetDescSameMd5(sameMd5));
                //分析数据 mapping数据
                dispatch(regetMapping(userMappingMap));
                //分析 同md5数据
                dispatch(regetContent(personDataList));
                //合计
                dispatch(regetDescSumCatg(getState, userDateTypeMap, sameDay, sameMd5));
                dispatch(regetDescDateTypeArr(getState, userDateTypeMap, sameDay, sameMd5));
                //数据存储
                dispatch(isLoadWait(false));
            })
            .catch(function (error) {
                console.log(error);
                dispatch(isLoadWait(false));
                dispatch(errorMsg(error));
            });

    }
}


//计算时间轴
const calculteTimeDataArrayByReget = (getState, userDateTypeMap, sameDay, sameMd5) => {
    const dateType = userDateTypeMap;
    const filterData = getState().data.filterData;
    const radioValue = filterData.radioValue;
    const showTypes = filterData
        .options
        .filter((option) => {
            return option.ischeck
        })
        .map((option) => {
            return option.value
        });
    const allTimeTypeData = [];
    Object
        .keys(dateType)
        .map(userNumberKey => {
            const userTimeTypeDataArr = dateType[userNumberKey];
            userTimeTypeDataArr.map(timeTypeData => {
                //没有过滤操作
                if (showTypes.indexOf(timeTypeData.catg) != -1 && filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5)) {
                    allTimeTypeData.push(timeTypeData)
                }
            })
        });
    //{time,catg,show,sameKey}
    const allTimes = allTimeTypeData.map((itemTypeData) => {
        return itemTypeData.time;
    })
    return timeArrayToTimeDataArray(allTimes);
}
//计算同一天
const calculteSameDayByReget = (userDateTypeMap) => {
    const sameDay = {};
    Object
        .keys(userDateTypeMap)
        .map(userNumber => {
            const userTimeTypeDataArr = userDateTypeMap[userNumber];
            const userHasDayMap = {};
            const hasAddDay = {};
            userTimeTypeDataArr.map(userTimeTypeData => {
                const day = userTimeTypeData.day;
                if (!hasAddDay[day]) {
                    if (typeof sameDay[day] == 'undefined') {
                        sameDay[day] = 1;
                    } else {
                        sameDay[day] = sameDay[day] + 1;
                    }
                    hasAddDay[day] = 1;
                }
            })
        });
    return sameDay;
}


//计算相同MD5
const calculteSameMd5ByReget = (userDateTypeMap) => {
    const sameMd5 = {};
    Object
        .keys(userDateTypeMap)
        .map(userNumber => {
            const userTimeTypeDataArr = userDateTypeMap[userNumber];
            let userHasMd5 = {};
            userTimeTypeDataArr.map(userTimeTypeData => {
                if (typeof sameMd5[userTimeTypeData.md5] == 'undefined') {
                    sameMd5[userTimeTypeData.md5] = {
                        count: 1,
                        day: userTimeTypeData.day
                    };
                    userHasMd5[userTimeTypeData.md5] = 1;
                } else {
                    if (!userHasMd5[userTimeTypeData.md5]) {
                        sameMd5[userTimeTypeData.md5].count = sameMd5[userTimeTypeData.md5].count + 1;
                    }
                }
            })
        })
    return sameMd5;
}



//计算合计
const calculteSumCatgByReget = (getState, userDateTypeMap, sameDay, sameMd5) => {
    const filterData = getState().data.filterData;
    const radioValue = filterData.radioValue;
    const showTypes = filterData
        .options
        .filter((option) => {
            return option.ischeck
        })
        .map((option) => {
            return option.value
        });
    const sumCatg = {};
    Object
        .keys(userDateTypeMap)
        .map(userNumber => {
            const userTimeTypeDataArr = userDateTypeMap[userNumber];
            userTimeTypeDataArr.map(userTimeTYpeData => {
                if (showTypes.indexOf(userTimeTYpeData.catg) != -1 && filterByRadio(radioValue, userTimeTYpeData.day, userTimeTYpeData.md5, sameDay, sameMd5)) {
                    if (typeof sumCatg[userTimeTYpeData.catg] == 'undefined') {
                        sumCatg[userTimeTYpeData.catg] = 1;
                    } else {
                        sumCatg[userTimeTYpeData.catg] = sumCatg[userTimeTYpeData.catg] + 1
                    }
                }
            })
        })
    return sumCatg;
}

//重新检索-时间类型构建  date_type:
function regetDescDateTypeArr(getState, userDateTypeMap, sameDay, sameMd5) {
    const timeDataArray = calculteTimeDataArrayByReget(getState, userDateTypeMap, sameDay, sameMd5);
    const userNumberSize = Object
        .keys(userDateTypeMap)
        .length;
    const analyseDays = calculteAnalyseDays(sameDay, sameMd5, userNumberSize, timeDataArray);
    return {type: ActionTypes.DATA.DATA_DATETYPE_REGET, userDateTypeMap, timeDataArray, analyseDays}
}

function regetMapping(userMappingMap) {
    return {type: ActionTypes.DATA.DATA_MAPPING_REGET, userMappingMap}
}

//重新检索-合计构建
function regetDescSumCatg(getState, userDateTypeMap, sameDay, sameMd5) {
    const sumCatg = calculteSumCatgByReget(getState, userDateTypeMap, sameDay, sameMd5);
    return {type: ActionTypes.DATA.DATA_SUMCATG_REGET, sumCatg}
}
//重新检索-数据映射
function regetDescSameDay(sameDay) {
    return {type: ActionTypes.DATA.DATA_SAMEDAY_REGET, sameDay}
}

//重新检索-同md5
function regetDescSameMd5(sameMd5) {
    return {type: ActionTypes.DATA.DATA_SAMEMD5_REGET, sameMd5}
}

//重新比对内容部分
function regetContent(personDataList) {
    return {type: ActionTypes.DATA.DATA_REGET, personDataList}
}


export function addUserNumberArray(userNumberArray) {
    return (dispatch, getState) => {
        const userNumberArrayInState= getState().data.filterData.userNumberArray;
        dispatch(batchActions([loadWatiAct()], "addUserNumberArray_loading"));
        ///fwzy/do/track/dataList
        ///json/${userNumberArray.join(",")}.json
        return axios.get(`/fwzy/do/track/dataList`, {
            params: {
                zjhms: userNumberArray.join(","),
                kssj: getState()
                    .data
                    .filterData
                    .startTime
                    .replace("-", "")
                    .replace("-", "") + "000000",
                jssj: getState()
                    .data
                    .filterData
                    .endTime
                    .replace("-", "")
                    .replace("-", "") + "999999",
                lx: getState()
                    .data
                    .filterData
                    .options
                    .map((option) => {
                        return option.value
                    })
                    .join(","), //'wb,lg,hc,ky,fj,zk,qt,yl'
            },
                responseType: "json"
            })
            .then(function (response) {
                const personDataList = response.data;
                const userDateTypeMap = {};
                const userMappingMap = {};
                const userNumberStatus = userNumberArray.map(userNumber => {
                    return 0;
                });
                personDataList.map(personData => {
                    const userTimeTypeDataArr = [];
                    const userMapping = {};
                    userNumberStatus[userNumberArray.indexOf(personData.people.userNumber)] = 1;
                    personData
                        .content
                        .map((trace, index) => {
                            if (!trace.md5) {
                                trace.md5 = TraceCard.sameKeyGen(trace); //生成MD5
                            }
                            userTimeTypeDataArr.push({
                                time: trace.traceTime,
                                day: String(trace.traceTime).substr(0, 8),
                                catg: trace.catg,
                                md5: trace.md5
                            });
                            userMapping[trace.traceTime] = {
                                index: index
                            };
                        })
                    userDateTypeMap[personData.people.userNumber] = userTimeTypeDataArr;
                    userMappingMap[personData.people.userNumber] = userMapping;
                })

                //分析 同一天数据
                const sameDay = calculteSameDayByAddArray(getState,userDateTypeMap);
                const sameMd5 = calculteSameMd5ByAddArray(getState,userDateTypeMap);
                const sumCatg = calculteSumCatgByAddArray(getState, userDateTypeMap, sameDay, sameMd5);
                
                //身份证输入框数据
                const userNumberArrayInputAct = createAction(ActionTypes.DATA.ADD_USER_ARRAY_INPUT, () => {
                    return {
                        userNumberArray:userNumberArrayInState.concat(userNumberArray), 
                        userNumberStatus:getState().data.filterData.userNumberStatus.concat(userNumberStatus)
                      };
                });
                //同日数据
                const descSameDayByAddArrayAct = createAction(ActionTypes.DATA.DATA_SAMEDAY_REGET, () => {
                    return {sameDay};
                });
                //同md5
                const descSameMd5ByAddArrayAct = createAction(ActionTypes.DATA.DATA_SAMEMD5_REGET, () => {
                    return {sameMd5};
                });
                //数据mapping
                const mappingByArrayAct = createAction(ActionTypes.DATA.DATA_MAPPING_REGET, () => {
                    return {userMappingMap: Object.assign(getState().data.mappings,userMappingMap)};
                })
                //数据
                const contentByAddArrayAct = createAction(ActionTypes.DATA.DATA_REGET, () => {
                    return {personDataList};
                });
                //合计
                const descSumCatgByAddArrayAct = createAction(ActionTypes.DATA.DATA_SUMCATG_REGET, () => {
                    return {sumCatg};
                });

                const timeDataArray = calculteTimeDataArrayByAddArray(getState, userDateTypeMap, sameDay, sameMd5);
                const userNumberSize = Object.keys(userDateTypeMap).length+userNumberArrayInState.length;
                 //userNumberSize   
                const analyseDays = calculteAnalyseDays(sameDay, sameMd5, userNumberSize, timeDataArray);
                //时间轴
                const descDateTypeArrByAddArrayAct = createAction(ActionTypes.DATA.DATA_DATETYPE_REGET, () => {
                    return {userDateTypeMap,
                    timeDataArray,
                    analyseDays};
                })
                //loading状态
               
                dispatch(batchActions([
                    userNumberArrayInputAct(),
                    descSameDayByAddArrayAct(),
                    descSameMd5ByAddArrayAct(),
                    mappingByArrayAct(),
                    contentByAddArrayAct(),
                    descSumCatgByAddArrayAct(),
                    descDateTypeArrByAddArrayAct(),
                    loadWaitFalseAct(),
                ], 'BATCH_addUserNumberArray'))

                //分析数据 mapping数据 分析 同md5数据 合计 数据存储
            })
            .catch(function (error) {
                console.log(error);
                dispatch(
                    batchActions([
                        createAction(
                            ActionTypes.UI.LOADWAIT, () => {
                                return {loadStatus: false}
                            }
                        ),
                        createAction(
                            ActionTypes.DATA.ERROR_MSG,()=>{
                                return {errorMsg:error}
                            }
                        )  
                ], "ERROR_HANDLER"));
            });
    }
}




const calculteSameDayByAddArray = (getState,userDateTypeMap) => {
    const sameDay =_.cloneDeep(getState().data.desc.sameDay);
    Object
        .keys(userDateTypeMap)
        .map(userNumber => {
            const userTimeTypeDataArr = userDateTypeMap[userNumber];
            const userHasDayMap = {};
            const hasAddDay = {};
            userTimeTypeDataArr.map(userTimeTypeData => {
                const day = userTimeTypeData.day;
                if (!hasAddDay[day]) {
                    if (typeof sameDay[day] == 'undefined') {
                        sameDay[day] = 1;
                    } else {
                        sameDay[day] = sameDay[day] + 1;
                    }
                    hasAddDay[day] = 1;
                }
            })
        });
    return sameDay;
}


const calculteSameMd5ByAddArray = (getState,userDateTypeMap) => {
    const  sameMd5=_.cloneDeep(getState().data.desc.sameMd5);
    Object
        .keys(userDateTypeMap)
        .map(userNumber => {
            const userTimeTypeDataArr = userDateTypeMap[userNumber];
            let userHasMd5 = {};
            userTimeTypeDataArr.map(userTimeTypeData => {
                if (typeof sameMd5[userTimeTypeData.md5] == 'undefined') {
                    sameMd5[userTimeTypeData.md5] = {
                        count: 1,
                        day: userTimeTypeData.day
                    };
                    userHasMd5[userTimeTypeData.md5] = 1;
                } else {
                    if (!userHasMd5[userTimeTypeData.md5]) {
                        sameMd5[userTimeTypeData.md5].count = sameMd5[userTimeTypeData.md5].count + 1;
                    }
                }
            })
        })
    return sameMd5;
}


//计算合计
const calculteSumCatgByAddArray= (getState, userDateTypeMap, sameDay, sameMd5) => {
    const filterData = getState().data.filterData;
    const radioValue = filterData.radioValue;
    const showTypes = filterData
        .options
        .filter((option) => {
            return option.ischeck
        })
        .map((option) => {
            return option.value
        });
    const sumCatg = getState().data.desc.sumCatg||{};
    Object
        .keys(userDateTypeMap)
        .map(userNumber => {
            const userTimeTypeDataArr = userDateTypeMap[userNumber];
            userTimeTypeDataArr.map(userTimeTypeData => {
                if (showTypes.indexOf(userTimeTypeData.catg) != -1 && 
                filterByRadio(radioValue, userTimeTypeData.day, 
                    userTimeTypeData.md5, sameDay, sameMd5)) {
                    if (typeof sumCatg[userTimeTypeData.catg] == 'undefined') {
                        sumCatg[userTimeTypeData.catg] = 1;
                    } else {
                        sumCatg[userTimeTypeData.catg] = sumCatg[userTimeTypeData.catg] + 1
                    }
                }
            })
        })
    return sumCatg;
}


const calculteTimeDataArrayByAddArray = (getState, userDateTypeMap, sameDay, sameMd5) => {
    const dateTypeInState = getState().data.desc.date_type;
    const userNumbersInState = Object
    .keys(dateTypeInState)
    .filter(item => {
        return !(item == 'timeDataArray' || item == 'analyseDays')
    });
    const dateType = userDateTypeMap;
    const filterData = getState().data.filterData;
    const radioValue = filterData.radioValue;
    const showTypes = filterData
        .options
        .filter((option) => {
            return option.ischeck
        })
        .map((option) => {
            return option.value
        });
    const allTimeTypeData = [];
    Object
        .keys(dateType)
        .map(userNumberKey => {
            const userTimeTypeDataArr = dateType[userNumberKey];
            userTimeTypeDataArr.map(timeTypeData => {
                //没有过滤操作
                if (showTypes.indexOf(timeTypeData.catg) != -1 && filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5)) {
                    allTimeTypeData.push(timeTypeData)
                }
            })
        });
        
    const allTimeTypeDataInState = [];
    userNumbersInState.map(userNumberKey => {
            const timeTypeDataArrInState = dateTypeInState[userNumberKey];
            timeTypeDataArrInState.map(timeTypeData => {
                //没有过滤操作
                if (showTypes.indexOf(timeTypeData.catg) != -1) {
                    if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5, userNumbersInState.length+   Object
                        .keys(dateType).length)) {
                        allTimeTypeDataInState.push(timeTypeData.time);
                    }
                }
            })
    });

    //{time,catg,show,sameKey}
    const allTimes =_.union(allTimeTypeData.map((itemTypeData) => {return itemTypeData.time;}),allTimeTypeDataInState,true) 
    return timeArrayToTimeDataArray(allTimes);
}


export function errorMsg(errorMsg) {
    return {type: ActionTypes.DATA.ERROR_MSG, payload:{errorMsg}}
}

function notifyMsg(notifyMsg, notifyDesc) {
    return {type: ActionTypes.DATA.NOTIFY_MSG, notifyMsg, notifyDesc}
}
