import { connect } from 'react-redux'
import React from 'react';
import Handle from '../PartOption/handle'
import { Spin, Row, Col, Input, Radio, Select, Icon, Button as AntButton, Switch, Table } from 'antd';
import classNames from 'classnames/bind';
import * as Actions from '../../Actions/Actions';
import PeoplePic from '../PartOption/peoplePic';
import PeopleTraceList from '../PartOption/PeopleTraceList';
import OneDayIndex from '../PartOption/oneDayIndexOption';
import DetailOption from '../PartOption/detailOption';
import HeatMap from '../HeatMap/HeatMap.js';
import moment from 'moment';
import _ from 'lodash';
// import 'react-vis/dist/style.css';
// import {
//     XYPlot,
//     XAxis,
//     YAxis,
//     VerticalBarSeries,
//     VerticalGridLines,
//     HorizontalGridLines,
//     VerticalRectSeries
// } from 'react-vis';
// import CalendarHeatmap from 'react-calendar-heatmap';
// import Immutable from 'immutable';
import { Classes,Button, EditableText,Intent } from "@blueprintjs/core";
import { TagInput } from "@blueprintjs/labs";
import "@blueprintjs/core/dist/blueprint.css";
import "@blueprintjs/labs/dist/blueprint-labs.css"

const BASELINE_HEIGHT = 35;
const TOP_HEIGHT = 60;
const SEARCH_BAR = 40;
const BOTTOM_HEIGHT = 160;
const PERSON_ROW_HEIGHT = 120;
const LEFT_HEIGHT = 116;
const splitRegex=/[\,\ \;\'\"]+/
const Option = Select.Option;
// const timestamp = new Date('May 23 2017').getTime();
// const ONE_DAY = 86400000;

// const DATA = [
//     { x: 'a', y: 1 },
//     { x: 'b', y: 2 },
//     { x: 'c', y: 1 },
//     { x: 'd', y: 2 },

// ]
// const DATA2 = [
//     { x: 'a', y: 1 },
//     { x: 'b', y: 2 },
//     { x: 'c', y: 1 },
//     { x: 'd', y: 2 },
// ]

const TimeLine = ({ timeDataArray }) => {
    return (
        <div>
            {timeDataArray.map((timeData => {
                return (<OneDayIndex day={timeData.day} dayData={timeData.dayData} />)
            }))}
        </div>
    );
}

class TimeSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { nowMonth: null };
    }

    render() {
        const { timeDataArray, changeTimeSelect } = this.props;
        const { nowMonth } = this.state;
        let currentMonth = null;
        if (timeDataArray.length > 0) {
            currentMonth = nowMonth ? nowMonth : timeDataArray[0].month;
        }
        return (
            <Select
                key="TimeSelect-ant-select"
                size="small"
                value={currentMonth}
                onChange={changeTimeSelect}
                style={{ width: "75px" }}>
                {
                    //日期
                    timeDataArray.map(
                        (timeData) => {
                            return (
                                <Option key={`TimeSelect-ant-select-option-${timeData.month}`}
                                    value={timeData.month}>{timeData.month}</Option>
                            )
                        }
                    )
                }
            </Select>
        )
    }
}

class MonthLeftShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { nowMonth: null };
    }

    render() {
        let currentMonth = null;
        const { nowMonth } = this.state;
        const { userNumberSize, timeDataArray } = this.props;
        if (timeDataArray.length > 0) {
            currentMonth = nowMonth ? nowMonth : timeDataArray[0].month;
        }
        if (userNumberSize == 0) {
            return (null);
        }
        return (<h5 style={{ height: BASELINE_HEIGHT }}><a>{moment(currentMonth, "YYYYMM").format("YYYY年MM月")}</a></h5>);
    }
}

const Peoples = () => {
}

const PersonTaces = ({ showDetailFunc, data }) => {
    let all = [];
    let count = 0;
    for (let userNumber in data.loadData) {
        all.push(
            <PeopleTraceList
                key={`PeopleTraceList-${userNumber}`}
                classNameExt={classNames({ "odd": count % 2 != 0, "even": count % 2 == 0 })}
                userNumber={userNumber}
                data={data}
                showDetailFunc={showDetailFunc}
            />)
        count++;
    }
    return (
        <div>
            {all}
        </div>
    );
}

const chartDataByMonth = (chartData) => {
    let min = 0, max = 0;
    const userTimeDatas = Object.keys(chartData).map(userNumber => {
        const timeDataArray = chartData[userNumber];
        //  let chartUserMonth={[userNumber]:[]}
        let monthCount = {};
        timeDataArray.map(timeData => {
            if (!monthCount[timeData.month]) {
                monthCount[timeData.month] = timeData.dayData.length;
            } else {
                monthCount[timeData.month] = monthCount[timeData.month] + timeData.dayData.length;
            }
            min = min < monthCount[timeData.month] ? min : monthCount[timeData.month];
            max = max > monthCount[timeData.month] ? max : monthCount[timeData.month];
        });
        const xData =
            Object.keys(monthCount).map(key => {
                return { x: key, y: monthCount[key] }
            })

        return { userNumber: userNumber, xData: xData };
    });

    return { min: min, max: max, userTimeDatas: userTimeDatas }
}

// const TraceChart = ({ userChartDataMonth }) => (
//     <XYPlot
//         xType="ordinal"
//         yDomain={[userChartDataMonth.min, userChartDataMonth.max]}
//         width={document.body.clientWidth - LEFT_HEIGHT}
//         height={139}>
//         <VerticalGridLines />
//         <HorizontalGridLines />
//         <XAxis />
//         <YAxis />
//         {
//             userChartDataMonth.userTimeDatas.map(
//                 item => {
//                     return (
//                         <VerticalBarSeries data={item.xData} style={{ stroke: '#fff' }} />
//                     )
//                 }
//             )
//         }
//     </XYPlot>
// );


// const TraceAnaylse = () => {

//     var until = '2016-06-30';
//     return (
//         <div >
//             <CalendarHeatmap
//                 horizontal={true}
//                 startDate={new Date("2016-11-01")}
//                 endDate={new Date('2017-11-06')}
//                 showWeekdayLabels={true}
//                 weekdayLabels={['日', '一', '二', '三', '四', '五', '六']}
//                 monthLabels={['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']}
//                 values={[
//                     { date: '2016-12-01', count: 1 },
//                     { date: '2016-01-03', count: 4 },
//                     { date: '2017-11-01', count: 2 },
//                     // ...and so on
//                 ]}
//             />
//         </div>
//     )
// }

const TraceTable = ({ loadData, timeDataArray, showTypes }) => {
    const userNumbers = Object.keys(loadData);

    const columns = [{
        title: '姓名',
        width: '10%',
        dataIndex: 'name',
    }, {
        title: '旅馆',
        width: '10%',
        dataIndex: 'lg',
    }, {
        title: '飞机',
        width: '10%',
        dataIndex: 'fj',
    },
    {
        title: '火车',
        width: '10%',
        dataIndex: 'hc',
    },
    {
        title: '客运',
        width: '10%',
        dataIndex: 'ly',
    },
    {
        title: '医疗',
        width: '10%',
        dataIndex: 'yl',
    },
    {
        title: '暂口',
        width: '10%',
        dataIndex: 'zk',
    },
    {
        title: '网吧',
        width: '10%',
        dataIndex: 'wb',
    },
    {
        title: '其他',
        width: '10%',
        dataIndex: 'qt',
    },];

    const allDays = timeDataArray.map(timeDataItem => {
        return timeDataItem.day;
    })
    const data = [];
    //过滤掉日期
    userNumbers.map(userNumber => {
        const user = { key: userNumber, name: loadData[userNumber].people.name };
        loadData[userNumber].content.map((trace) => {
            let traceDay = String(trace.traceTime).substr(0, 8);
            if (allDays.indexOf(traceDay) != -1 && showTypes.indexOf(trace.catg) != -1) {
                if (typeof user[trace.catg] == 'undefined') {
                    user[trace.catg] = 0;
                }
                user[trace.catg] = user[trace.catg] + 1;
            }
        })
        data.push(user);
    });

    return (
        <Table
            scroll={{ y: BOTTOM_HEIGHT - 45 }}
            columns={columns}
            dataSource={data}
            size="small"
            pagination={false} />
    );
}

const BaseTimeLine = ({ userNumberSize, timeDataArray, sameDay, sameMd5 }) => {
    const timeTokens = [];
    timeDataArray.map((timeData => {
        timeTokens.push(
            <OneDayIndex
                key={`${timeData.day}`}
                day={timeData.day}
                dayData={timeData.dayData}
                sameDay={sameDay}
                sameMd5={sameMd5}
                userNumberSize={userNumberSize}
            />);
    }))
    return (
        <div className="life-time-contant max-content">
            {timeTokens}
            <div className="life-today life-end">
                <span className="today-time life-radius"><b>End</b></span>
            </div>
        </div>
    );
};

class Content extends React.Component {

    constructor(props) {
        super(props);
        const { traceWidth } = this.props.ui;//窗口宽度
        this.monthPosition = {};
        this.dayPosition = {};
        // this.state = { nowMonth: null };
        // this.timePosition = {};//位置距离
        //console.log("this.timePosition %o", this.timePosition)
        //this.state = { scrollWidth: 0 };
    }

    componentWillUpdate(nextProps, nextState) {
        let tempPosition = {};
        const tempDayPosition = {};
        const timeDataArray = nextProps.data.desc.date_type.timeDataArray;
        let newDay = null;
        timeDataArray.map((timeData) => {
            if (typeof tempPosition[timeData.month] == 'undefined') {
                tempPosition[timeData.month] = 0;
            }
            if (typeof tempDayPosition[timeData.month] == 'undefined') {
                tempDayPosition[timeData.month] = {};
            }

            if (newDay != timeData.day) {
                tempPosition[timeData.month] = tempPosition[timeData.month] + 40;
                tempDayPosition[timeData.month][timeData.day] = 40;
            }
            timeData.dayData.map((timeInDay) => {
                tempPosition[timeData.month] = tempPosition[timeData.month] + 210;
                tempDayPosition[timeData.month][timeData.day] += 210;
            });

        });
        this.monthPosition = tempPosition;
        this.dayPosition = tempDayPosition;
       // console.log("%o 转时间monthpositon: %o,dayPosition:%o", timeDataArray, this.monthPosition, this.dayPosition);
    }

    moveTimeScroller = (value) => {
        let nowMonth = null;
        let months = Object.keys(this.monthPosition).sort(function (a, b) {
            return b - a;
        });
        for (var i = 0; i < months.length; i++) {
            var month = months[i];
            value = value - this.monthPosition[month];
            if (value < 0) {
                nowMonth = month;
                break;
            }
        }


        // for (var month in this.timePosition) {
        //     value = value - this.timePosition[month];
        //     if (value < 0) {
        //         nowMonth = month;
        //         break;
        //     }
        // }
        //this.refs.timeSelectRef.setState({ nowMonth });

        this.refs.monthLeftShowRef.setState({ nowMonth })
    }

    changeTimeSelect = (nowMonth) => {
        // this.refs.timeSelectRef.setState({ nowMonth })
        let scrollerWidth = 0;
        let months = Object.keys(this.monthPosition).sort(function (a, b) {
            return b - a;
        });
        for (var i = 0; i < months.length; i++) {
            var month = months[i];
            if (month == nowMonth) {
                break;
            }
            scrollerWidth += this.monthPosition[month];
        }
       // console.log("changeTimeSelect:", nowMonth, scrollerWidth, this.monthPosition)
        this.refs.personTraceRef.scrollLeft = scrollerWidth;
        this.refs.timelineRef.scrollLeft = scrollerWidth;
    }

    moveToDay = (clickDay) => {
        let nowMonth = clickDay.substr(0, 6);
        let scrollerWidth = 0;
        let months = Object.keys(this.monthPosition).sort(function (a, b) {
            return b - a;
        });
        for (var i = 0; i < months.length; i++) {
            var month = months[i];
            if (month == nowMonth) {
                break;
            }
            scrollerWidth += this.monthPosition[month];
        }

        const dayWidthInMonth = this.dayPosition[nowMonth];
        const dayKeys = Object.keys(dayWidthInMonth).sort(function (a, b) {
            return b - a;
        });
        for (var i = 0; i < dayKeys.length; i++) {
            var dayKey = dayKeys[i];
            if (dayKey == clickDay) {
                break;
            }
            scrollerWidth += dayWidthInMonth[dayKey];
        }
        // scrollerWidth += this.dayPosition[dayClick];
        console.log("changeTimeSelect:", nowMonth, scrollerWidth, dayWidthInMonth, );
        this.refs.personTraceRef.scrollLeft = scrollerWidth;
        this.refs.timelineRef.scrollLeft = scrollerWidth;
    }


    clickDayHeatMap = (tokenDate, dayData) => {
        //时间选择操作
        this.moveToDay(tokenDate);
        //console.log("tokenDate", tokenMonth)
    }


    handlerSearch=()=>{
        const {inputValue}=this.refs.tagInput.state;
        this.handlerUserNumbers(inputValue);
        //this.refs.tagInput.setState({inputValue:""}) 
        
    }

    handlerUserNumbers=(inputValue)=>{
        const {data, errorMessage} = this.props;
        const {userNumberArray}=data.filterData;
        let userNumberError=[];
        let userNumberMsgError="";
        if(inputValue===''){
            //重新加载    
           errorMessage("请输入身份证");
           return ;
        }
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        const userNumbers=inputValue.split(splitRegex).filter(item=>{
                return item.length!=0;
            }
        ); 
        for(var i=0;i<userNumbers.length;i++){
            var itemNumber=userNumbers[i];
            if(reg.test(itemNumber) === false) {
                userNumberError.push(itemNumber);  
            }
        }
        if(userNumberError.length>0){
            errorMessage(`身份证${userNumberError.join(",")}格式有误，请重新输入！`);
            return;
        }
        const sameUserNumbers=_.intersection(userNumbers,userNumberArray);
        if(sameUserNumbers.length>0){
                //有重复
                errorMsg(`对不起身份证${sameUserNumbers.join(",")}已存在`);
                return ;
        }
        this.props.addUserNumberArray(userNumbers);
        this.refs.tagInput.setState({inputValue:""});
    }


    getTagProps=(value,index)=>{
       // var self=this;
       // console.log("value",value,"index:",index);
        return {
            className:Classes.MINIMAL,
        };
    }


    handlerAdd=(values)=>{
        this.props.addUserNumberArray(values);
    }
    handlerRemove=(values)=>{
        const sfzh=values.props.children;
        this.props.deleteUserNumber(sfzh);
    }


    componentDidMount() {
        //const { moveTimeScroller } = this.props;
        const self = this;
        const {userNumbers}=this.props;
        if(userNumbers){
            this.handlerUserNumbers(userNumbers)
        }
        this.refs.personsRef.addEventListener('scroll', () => {
            this.refs.personTraceRef.scrollTop = this.refs.personsRef.scrollTop;
        });
        this.refs.personTraceRef.addEventListener('scroll', () => {
            //年月切换
            const value = this.refs.personTraceRef.scrollLeft;
            self.moveTimeScroller(value);
            this.refs.timelineRef.scrollLeft = value;
        });
    }


    render() {
        let { ui, data, showTimeIndex, addUser, showDetailFunc, changeShowChart, changeSameRadioFunc } = this.props;
        console.log("content改变：", this.props);
        const { loadData, chartData,filterData } = data;
        const self=this;
        let height = {};
        const userNumberSize = Object.keys(loadData).length;
        if (ui.Top.showTop) {
            height = window.innerHeight - (TOP_HEIGHT + BOTTOM_HEIGHT + SEARCH_BAR);
        } else {
            height = window.innerHeight - (BOTTOM_HEIGHT + SEARCH_BAR);
        }
        if (userNumberSize != 0) {
            //有用户，出现日期条
            height = height - BASELINE_HEIGHT;
        }

        const { timeDataArray, analyseDays } = data.desc.date_type;
        const sameDay = data.desc.sameDay;
        const sameMd5 = data.desc.sameMd5;
        const userChartDataMonth = chartDataByMonth(chartData);
        let timeChoose = data.filterData.timeChoose;
        if (timeChoose == null) {
            if (timeDataArray.length > 0) {
                timeChoose = timeDataArray[0].month;
            }
        }
        const showTypes = data.filterData.options.filter((option) => {
            return option.ischeck
        }).map((option) => {
            return option.value
        });
        const { radioValue, startTime, endTime ,userNumberArray,userNumberStatus} = filterData;
        const values=userNumberArray.map((userNumber,idx)=>{
            if(userNumberStatus[idx]){
                return (<b>{userNumber}</b>)
            }
        });
       
        const clearButton = (
            <Button
                className={classNames( Classes.INTENT_PRIMARY)}
                iconName={"search"}
                onClick={this.handlerSearch}
            >分析</Button>
        );

        return (
            <Row>
                <Col span="24">
                    <Handle />
                    <div className="index-left" style={{ overflowX: "hidden" }}>
                        <Spin tip="Loading..." spinning={ui.isLoad.isLoadStatus}>
                            <h1>对比人数<span>{userNumberSize != 0 ? ` ${userNumberSize} ` : ""}</span></h1>
                            <MonthLeftShow ref={"monthLeftShowRef"} userNumberSize={userNumberSize}
                                timeDataArray={timeDataArray} />
                            <ul
                                ref={"personsRef"}
                                className="life-person"
                                style={{ height: height, maxHeight: height, overflowX: "hidden" }}>
                                {Object.keys(loadData).map(key => {
                                    return (
                                        <PeoplePic pname={loadData[key].people.name}
                                            userNumber={loadData[key].people.userNumber}
                                            key={key}
                                        />);
                                })}
                            </ul>
                        </Spin>
                    </div>

                    <div className="collect">
                        <div style={{float:"left",marginLeft:"10px",width:"650px",marginRight:"5px"}}>
                            <TagInput
                                //ref={"tagInput"}
                                ref={(tagInput)=>{self.refs.tagInput=tagInput}}
                                inputProps={{style:{width:'140px'},handleInputKeyDown:(event)=>{
                                    //console.log("修改了...");
                                }}}
                                className={Classes.FILL}
                                //rightElement={clearButton}
                                leftIconName="user"
                                onAdd={this.handlerAdd}
                                onRemove={this.handlerRemove}
                                separator={splitRegex}
                                //onChange={this.handlerChange}
                                //onChange={this.handleChange}
                                placeholder="多个身份证可以使用逗号、封号、空格分隔"
                                tagProps={this.getTagProps}
                                // tagProps={getTagProps}
                                values={values}
                            />
                        </div>
                        {clearButton}
                        {/* <AntButton type="primary" icon="search" size="small" onClick={
                            () => {
                                // if (!ui.isLoad.isLoadStatus) {
                                //     addUser(this.refs.userNumberInput.refs.input.value)
                                // }
                            }
                        }>分析</AntButton> */}

                        {/* <Input
                            ref={"userNumberInput"}
                            size="small"
                            placeholder="请输入证件号码"
                            style={{ width: 160, margin: "0px 10px 0px 10px " }}
                            onPressEnter={(e) => {
                                if (!ui.isLoad.isLoadStatus) {
                                    addUser(e.target.value)
                                }
                            }}
                        /> */}
                      
                        <Radio.Group value={radioValue} onChange={changeSameRadioFunc} style={{ marginLeft: 15 }}>
                            <Radio value={"all"}><b className="all">所有</b></Radio>
                            <Radio value={"sameDay"}><b className="sameDay">同日</b></Radio>
                            <Radio value={"sameTwo"}><b className="sameTwo">两两相同</b></Radio>
                            <Radio value={"sameAll"}><b className="sameAll">完全相同</b></Radio>
                        </Radio.Group>
                    </div>

                    {userNumberSize == 0 ?
                        null : (
                            <div
                                ref="timelineRef" className="collect-right" style={{ overflowX: "hidden" }}>
                                <BaseTimeLine
                                    key="baseLine"
                                    timeDataArray={timeDataArray}
                                    sameDay={sameDay}
                                    sameMd5={sameMd5}
                                    userNumberSize={userNumberSize}
                                />
                            </div>
                        )
                    }
                    <div
                        className="life-view "
                        style={{ overflowY: "hidden" }}>
                        <Spin tip="Loading..." spinning={ui.isLoad.isLoadStatus}>
                            <div
                                ref={"personTraceRef"}
                                style={{
                                    minHeight: height,
                                    maxHeight: height,
                                    overflowY: "hidden"
                                }}>
                                <PersonTaces
                                    key="PersonTaces"
                                    data={data}
                                    height={height}
                                    showDetailFunc={showDetailFunc}
                                />
                            </div>
                        </Spin>
                    </div>
                    <div
                        className="b-right" style={{ overflow: "hidden", height: BOTTOM_HEIGHT}}>
                        <Row gutter={4}>
                            <Col span={16} style={{ overflowY:"hidden",overflowX:"auto" }}>
                                    <div style={{
                                        width:'40px',
                                        height:BOTTOM_HEIGHT,
                                        textAlign:"center",
                                        fontSize:"14px",
                                        fontWeight:"bolder",
                                        float:"left",
                                        boxShadow: '-6px 0 6px -4px rgba(0,0,0,.2)',
                                        writingMode:"tb-rl"}}>
                                        轨迹分析
                                    </div>
                                    <HeatMap
                                        height={BOTTOM_HEIGHT}
                                        data={analyseDays}
                                        startDay={moment(endTime, "YYYY-MM-DD").format("YYYYMMDD")}
                                        endDay={moment(startTime, "YYYY-MM-DD").format("YYYYMMDD")}
                                        //titleForDay={() => { }}
                                        clickForDay={this.clickDayHeatMap}
                                    />
                            </Col>
                            <Col span={8} style={{ height: BOTTOM_HEIGHT,boxShadow: '-6px 0 6px -4px rgba(0,0,0,.2)', }}>
                                    <TraceTable
                                        loadData={loadData}
                                        timeDataArray={timeDataArray}
                                        showTypes={showTypes}
                                    />
                            </Col>
                        </Row>
                    </div>
                    <DetailOption />
                </Col>
            </Row>
        )
    }

   
}
 //时间滚动条
//
//<TraceAnaylse />

function mapStateToProps(state) {
    return {
        data: state.data,
        ui: state.ui,
        isTopShow: state.ui.Top.showTop,
        isLoadStatus: state.ui.isLoad.isLoadStatus,
        // showTimeIndex: (timeIndex) => {
        //    dispatch(Actions.loadTimeLine(timeIndx));
        // }
    }
}
function mapDispatchToProps(dispatch) {
    return {
        addUser: (value) => {
            dispatch(Actions.loadData(value));
        },
        addUserNumberArray:(newUserArray)=>{
            dispatch(Actions.addUserNumberArray(newUserArray));
        },
        deleteUserNumber:(userNumer)=>{
            dispatch(Actions.dataCancel(userNumer));
        },
        changeShowChart: (value) => {
            dispatch(Actions.changeShowChart(value));
        },
        // changeTimeSelect: (value) => {
        //     dispatch(Actions.changeTimeSelect(value));
        // },
        showDetailFunc: (hbaseKey) => {
            dispatch(Actions.loadDetail(hbaseKey))
        },
        // moveTimeScroller: (value) => {
        //     //dispatch(Actions.scrollerTimeLine(value));
        // },
        changeSameRadioFunc: (e) => {
            dispatch(Actions.changeSameRadio(e.target.value))
        },
        errorMessage:(msg)=>{
            dispatch(Actions.errorMsg(msg))
        }


    }
}
//<Switch size="small" checked={ui.showChart} onChange={changeShowChart} />
export default connect(mapStateToProps, mapDispatchToProps
)(Content)

