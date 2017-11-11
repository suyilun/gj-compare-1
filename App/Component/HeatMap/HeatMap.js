import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import _ from 'lodash';
import { Tooltip } from 'antd';
import moment from 'moment';
require("./HeatMap.less");
const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
//const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
// const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const DAY_LABELS = ['', '周一', '', '周三', '', '周五', ''];
const WEEK_X = 20;
const WEEK_Y = 40;
const MONTH_X = 50;
const MONTH_Y = 10;
const DAYS_X = 60;
const DAYS_Y = 30;//距离顶部距离
const GUTTER_SPACE = 1;
const DAY_WIDTH = 10;
const COLOR_EMPTY = "color-empty";
const COLOR_FILLED = "color-filled";
const GWeekLabel = ({ weekLabels, startMoment, endMoment }) => {
    const weeks = [];
    for (var i = 0; i < 7; i++) {
        if (i % 2 != 0) {
            weeks.push(<text x={0} y={(i) * DAY_WIDTH + GUTTER_SPACE} >{weekLabels[i]}</text>);
        }
    }
    return (
        <g transform={`translate(${WEEK_X}, ${WEEK_Y})`}>
            {weeks}
        </g>
    );
}

const GMonthLabel = ({ monthLabels, startDay, endDay }) => {
    const months = [];
    let startMoment=  moment(startDay,"YYYYMMDD");
    let endMoment= moment(endDay,"YYYYMMDD");
    let dayInWeek = startMoment.day();
    let dateInMonth = startMoment.date();
    let weekNums = 0;
   

    endMoment = endMoment.add(-1, "day");
    while (!startMoment.isSame(endMoment)) {
        if (dayInWeek == 7) {
            weekNums++;
            dayInWeek = 0;
        }
        if (startMoment.date() == 1) {
            months.push(
                <text x={(GUTTER_SPACE + DAY_WIDTH) * (weekNums + 1)} y={10}>{monthLabels[startMoment.month()]}</text>
            )
        }
        dayInWeek++;
        startMoment.add(-1, "day");
    }

    return (
        <g transform={`translate(${MONTH_X}, ${MONTH_Y})`}>
            {months}
        </g>);
}

const GDayRects = ({ startDay, endDay, dataMap, classForDay, titleForDay, clickForDay }) => {

    let startMoment=  moment(startDay,"YYYYMMDD");
    let endMoment= moment(endDay,"YYYYMMDD");
  
    const weekDays = [];
    let weekNum = 0;
    endMoment = endMoment.add(-1, "day");
    while (startMoment.isAfter(endMoment)) {
        let daysInWeek = [];
        let countWeek = 7;
        if (weekNum == 0) {
            countWeek = startMoment.day() + 1;
        }
        while (countWeek > 0 && startMoment.isAfter(endMoment)) {
            console.log("GDayRects")
            const tokenDate = startMoment.format("YYYYMMDD");
            const dayData = dataMap[tokenDate];
            const tokenClass = classNames({
                [COLOR_EMPTY]: typeof dayData == "undefined",
                [_.has(dayData, "value") ? `color-filled-${dayData.value}` : '']: true,
                [classForDay(dayData)]: true
            });
            let token = (
                <rect
                    x={GUTTER_SPACE}
                    y={(DAY_WIDTH + GUTTER_SPACE) * (startMoment.day())}
                    width={DAY_WIDTH}
                    height={DAY_WIDTH}
                    className={tokenClass}>
                    {dayData ? null : (<title>{titleForDay(tokenDate, dayData)}</title>)}
                </rect>
            );
            if (dayData) {
                const title = titleForDay(tokenDate, dayData);
                token = (
                    <Tooltip
                        title={title}
                        onClick={() => { clickForDay ? clickForDay(tokenDate, dayData) : () => { } }}
                    >
                        {token}
                    </Tooltip>
                )
            }
            daysInWeek.push(token);
            countWeek--;
            startMoment.add(-1, "day");
        }
        weekDays.push(
            <g transform={`translate(${weekNum * (DAY_WIDTH + 1)},0)`}>
                {daysInWeek}
            </g>
        )
        weekNum++;
    }
    return (
        <g transform={`translate(${DAYS_X}, ${DAYS_Y})`}>
            {weekDays}
        </g>
    );
}

const GDescription = ({ }) => {
    return (
        <g transform={`translate(100, 120)`}>
            <g transform={`translate(0, 0)`}>
                <rect width={10} height={10} className={"color-filled-1"} />
                <text transform={"translate(10,10)"}>有轨迹</text>
            </g>
            <g transform={`translate(80, 0)`}>
                <rect width={10} height={10} className={"color-filled-2"} />
                <text transform={"translate(10,10)"}>同日轨迹</text>
            </g>

            <g transform={`translate(160, 0)`}>
                <rect width={10} height={10} className={"color-filled-3"} />
                <text transform={"translate(10,10)"}>两两相同</text>
            </g>

            <g transform={`translate(240, 0)`}>
                <rect width={10} height={10} className={"color-filled-4"} />
                <text transform={"translate(10,10)"}>完全相同</text>
            </g>
        </g>
    );
}

export default class HeatMap extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        startDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        endDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        monthLabels: PropTypes.array,
        weekLabels: PropTypes.array,
        classForDay: PropTypes.func,
        titleForDay: PropTypes.func,
        clickForDay: PropTypes.func,
        data: PropTypes.array,//展示数据，
    };
    static defaultProps = {
        title: null,
        monthLabels: MONTH_LABELS,
        weekLabels: DAY_LABELS,
        classForDay: (dayData) => {
            return '';
        },
        titleForDay: (tokenDate, dayData) => {
            return `${tokenDate}`;
        },
        clickForDay: (tokenDate, dayData) => {
            console.log("clickForDay", dayData)
        },
        data: {
            '2017-10-22': 1,
            '2017-10-25': 2,
            '2017-10-28': 3,
            '2017-11-01': 4
        }
        ,
        startDay:'20170101',//moment(new Date()).format("YYYYMMDD"),
        endDay: '20171111',//moment(new Date()).add(-365, "day").format("YYYYMMDD"),
    }
    render() {
        const { title,height, monthLabels, weekLabels, startDay, endDay, data, classForDay, titleForDay, clickForDay } = this.props;
        const dataMap = {};
        const weekNumSize=Math.ceil(moment(startDay).diff(moment(endDay))/(1000*60*60*24*7));
        Object.keys(data).map(day => {
            dataMap[day] = { value: data[day] }
        })
        const svgWidth=weekNumSize*11+80;
        // data.map(dataRow => {
        //     dataMap[dataRow.time] = dataRow;
        // })
        // console.log("startM", startMoment.format("M"), startMoment.day(), startMoment.date());
        // console.log("endM", endMoment.format("M"), endMoment.day(), dataMap);
        // 如果没有title
        return (
            <svg
                width={svgWidth}
                height={height-20}
                className={"heat-map"}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <GMonthLabel
                    monthLabels={monthLabels}
                    startDay={startDay}
                    endDay={endDay}
                />
                <GWeekLabel
                    weekLabels={weekLabels}
                />
                <GDayRects
                    dataMap={dataMap}
                    classForDay={classForDay}
                    titleForDay={titleForDay}
                    clickForDay={clickForDay}
                    startDay={startDay}
                    endDay={endDay}
                />

                <GDescription />

            </svg>
        );
    }
}