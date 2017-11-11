import { connect } from 'react-redux';
import { Tooltip } from 'antd';
import React from 'react';
import classNames from 'classnames/bind';
import moment from 'moment';
moment.locale('zh-cn');
import * as Actions from '../../Actions/Actions';

// 6,2
const OneDayIndexShow = ({ day, dayData, sameDay, sameMd5 }) => {
    const isSameDay = sameDay[day] ? sameDay[day] > 1 : false;
    let prevDayTime = null;
    const tokens = [];
    dayData.map((time, index) => {
        let timeStr = String(time);
        let dayTime = `${timeStr.substr(8, 2)}:${timeStr.substr(10, 2)}`;

        // if(prevDayTime!=dayTime){
        tokens.push(
            (
                <li key={`OneDayIndexShow-${index}`} >
                    <hr />
                    <span><i className={classNames('life-radius', { 'today-day': isSameDay, 'today-same': false })}></i></span>
                    <span><b>{`${timeStr.substr(8, 2)}:${timeStr.substr(10, 2)}`}:{timeStr.substr(12, 2)}</b></span>
                </li>
            )
        );
        //    prevDayTime=dayTime;
        //  }
    });
    return (
        <ul className="life-time max-content">
            <li className="life-today" id={`time-day-${day}`}>
                <hr />
                <span className="today-time life-radius">
                    <Tooltip
                        title={moment(day.substr(0,8),"YYYYMMDD").format("YYYY年MM月DD日")}
                    ><b>{day.substr(6, 2)}</b>
                    </Tooltip>
                </span>
            </li>
            {tokens}
        </ul>
    );
}

class OneDayIndex extends React.Component {
    render() {
        let { dayData, day, sameMd5, sameDay, userNumberSize } = this.props;
        return (
            <OneDayIndexShow day={day} dayData={dayData} sameMd5={sameMd5} sameDay={sameDay} userNumberSize={userNumberSize} />
        );
    }
}


export default OneDayIndex;
