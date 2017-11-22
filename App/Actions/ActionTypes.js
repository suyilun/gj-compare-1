//过滤
const FILTER = {
    OPTION: 'OPTION',
    SET_START_TIME: 'FILTER_START_TIME',
    SET_END_TIME: 'FILTER_END_TIME',
    SET_USERNUMBER: 'FILTER_USER_NUMBER',
    RADIO_CHANGE: 'RADIO_CHANGE',


}
//顶部筛选条件action Type
const OPTION = {
    ADD: 'ADD_OPTION',
    CHANGE_CHECK: 'OPTION_CHANGE_CHECK'
}

const DATA = {
    CANCEL: 'DATA_CANCEL',
    ADD_REQUEST: 'DATA_ADD_REQUEST',
    DATA_DELETE: 'DATA_DELETE',
    ADD_RECEIVE: 'ADD_RECEIVE',
    MAPPING: 'DATA_MAPPING',
    DELETE_MAPPING: 'DELETE_MAPPING',
    MD5_COLLECTOR: 'MD5_COLLECTOR',
    MD5_DELETE: 'MD5_DELETE',
    DATE_TYPE_COLLECTOR: 'DATE_TYPE_COLLECTOR',
    DATE_TYPE_DELETE: 'DATE_TYPE_DELETE',
    DATE_COLLECTOR: 'DATE_COLLECTOR',
    DATE_DELETE: 'DATE_DELETE',
    ADD_USER_TIME_INDEX: 'ADD_USER_TIME_INDEX',
    DEL_USER_TIME_INDEX: 'DEL_USER_TIME_INDEX',
    LOAD_ONETRACK_DETAIL: 'LOAD_ONETRACK_DETAIL',
    SUMCATG_COLLECTOR: 'SUMCATG_COLLECTOR',
    SUMCATG_DELETE: 'SUMCATG_DELETE',
    CHANGE_TIME_SELECT: 'CHANGE_TIME_SELECT',
    ERROR_MSG: 'ERROR_MSG',
    NOTIFY_MSG:'NOTIFY_MSG',
    ADD_USER_ARRAY_INPUT:'ADD_USER_ARRAY_INPUT',
    DEL_USER_INPUT:'DEL_USER_INPUT',

    DATA_REGET: 'DATA_REGET',
    DATA_DATETYPE_REGET:'DATA_DATETYPE_REGET',
    DATA_MAPPING_REGET:'DATA_MAPPING_REGET',
    DATA_SUMCATG_REGET:'DATA_SUMCATG_REGET',
    DATA_SAMEDAY_REGET:'DATA_SAMEDAY_REGET',
    DATA_SAMEMD5_REGET:'DATA_SAMEMD5_REGET',

}

//UI
const UI = {
    TOPSHOW: 'IS_TOP_SHOW',
    DETAILSHOW: 'IS_DETAIL_SHOW',
    LOADWAIT: 'IS_LOAD_WAIT',
    CHANGE_SHOW_CHART: 'CHANGE_SHOW_CHART',
    SCROLLER_TIME_LINE: 'SCROLLER_TIME_LINE',
}


const CHART = {
    CHART_ADD_DATA: 'CHART_ADD_DATA',
    CHART_DELETE_DATA: 'CHART_DELETE_DATA',

}

export default {
    OPTION, FILTER, UI, DATA, CHART

}