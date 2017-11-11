import * as Actions from '../../Actions/Actions';
import React from 'react';
import { connect } from 'react-redux';
import TraceCard from './TraceCard'
import classNames from 'classnames/bind';

class PeopleTraceList extends React.Component {

    renderOnePersonTrack = () => {
        const { userNumber, data, showFunc, showDetailFunc } = this.props;
        const { loadData, filterData, desc, mappings } = data;
        const { sameDay, sameMd5, date_type } = desc;
        const timeDataArray = date_type.timeDataArray;
        let userData = loadData[userNumber];
        let radioValue = filterData.radioValue;
        if (!userData) {
            return null;
        }
        const userTrace = userData.content;
        //({ month: 201409, day: 20140902, dayData: [20140902195800,...]});
        let result = []; let isFirst = false;
        const userMapping = mappings[userNumber];
        let count = 0;
        let prevDayTime = null;
        let userSizes = Object.keys(loadData).length;
        timeDataArray.map((timeData) => {
            isFirst = true;
            const isSameDay = sameDay[timeData.day] ? sameDay[timeData.day] > 1 : false;

            timeData.dayData.map(timeInDay => {
                const mappingItem = userMapping[timeInDay];
                let timeStr = String(timeInDay);
                if (mappingItem) {
                    const index = mappingItem.index;
                    const trace = userTrace[index];
                    if (!trace) {
                        return;
                    }
                    // let dayTime=`${timeInDay.substr(8,2)}:${timeStr.substr(10,2)}`;
                    // if(dayTime!=prevDayTime){
                    //
                    // }
                    //这里有一个问题
                    let isSameMd5 = sameMd5[trace.md5] ? sameMd5[trace.md5].count > 1 : false;
                    let isSameAll = sameMd5[trace.md5] ? sameMd5[trace.md5].count == userSizes : false;
                    if (userSizes == 1) {
                        isSameMd5 = false;
                        isSameAll = false;
                    }
                    const traceStyle = classNames({
                        "life-single": true,
                        "life-day": isSameDay,
                        "life-same-two": isSameMd5,
                        "life-same-all": isSameAll
                    });
                    if (isFirst) {
                        result.push(
                            <li
                                key={`trace-${userNumber}-${count}-day`}
                                className={'life-border-day'} />
                        )
                    }
                    result.push(
                        <li
                            key={`trace-${userNumber}-${count}`}
                            className={'life-border'}
                            onClick={() => { showDetailFunc(trace.hbaseKey) }}>
                            {TraceCard.showContent(trace, traceStyle)}
                        </li>
                    );
                } else {
                    if (isFirst) {
                        result.push(
                            <li key={`trace-${userNumber}-${count}-day`} className={'life-border-day'} />
                        )
                    }
                    result.push(
                        <li key={`trace-${userNumber}-${count}`} className={'life-border'} />
                    )
                }
                count++;
                isFirst = false;
            });
        })
        if (result.length > 0) {
            result.push(<li key={`${userNumber}-last`} className={'life-nbsp'} />)
        }
        return result;
    }

    render() {
        const { classNameExt } = this.props;
        return (
            <ul key="PeopleTraceList-ul" className={`life-box max-content ${classNameExt}`}>
                {
                    this.renderOnePersonTrack()
                }
            </ul>
        )
    }
}

export default PeopleTraceList;

//export default connect(mapStateToProps,mapDispatchToProps)(PeopleDataList)