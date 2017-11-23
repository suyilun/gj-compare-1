import { connect } from 'react-redux'
import React from 'react';
import classNames from 'classnames/bind';
import * as Actions from '../../Actions/Actions';
import { Row, Col, DatePicker } from 'antd';
import { Classes,Button, EditableText,Intent } from "@blueprintjs/core";
import moment from 'moment';
moment.locale('zh-cn');


const Option = ({ ischeck, optionClass, optionName, checkOption, sumRows }) => (
    <li className={ischeck ? optionClass + ' life-check' : optionClass} onClick={checkOption}>
        <p href="javascript:;">
            <i></i>
            <span>{optionName}{sumRows != 0 ? `(${sumRows})` : ''}</span>
        </p>
    </li>
)

class Head extends React.Component {
    render() {
        //console.log("top改变:",this.props)
        let { topShow, filterData, sumCatg, setStartTime, setEndTime, checkOption, reGetTraces } = this.props;
        const { options, startTime, endTime, } = filterData;
        return (
            <Row className="top" style={{ display: topShow ? 'block' : 'none' }}>
                <Col span="16">
                    <a href="javascript:;" className="logo">
                    </a>
                    <ul className="life-class">
                        {
                            options.map((option, index) => {
                                return (
                                    <Option
                                        key={`option-${option.value}`}
                                        ischeck={option.ischeck}
                                        optionName={option.optionName}
                                        optionClass={option.optionClass}
                                        sumRows={sumCatg[option.value] ? sumCatg[option.value] : 0}
                                        checkOption={() => { checkOption(option.value, !option.ischeck) }}
                                    />)
                            })
                        }
                    </ul>
                </Col>
                <Col span="8">
                    <div className={"searchAgain"}>
                     <div style={{float:"left",marginRight:"5px"}}>
                        <DatePicker
                            defaultValue={moment(startTime, 'YYYY-MM-DD')}
                            onChange={(date, dateString) => { setStartTime(dateString) }}
                            allowClear={false}
                        />
                        -
                         <DatePicker
                            defaultValue={moment(endTime, 'YYYY-MM-DD')}
                            onChange={(date, dateString) => { setEndTime(dateString) }}
                            allowClear={false} />
                       </div> 
                        <Button
                            className={classNames( Classes.INTENT_PRIMARY)}
                            iconName={"pt-icon-refresh"}
                            onClick={reGetTraces}
                        >重新比对</Button>
                      
                    </div>
                </Col>
            </Row>
        )
    }
}
function mapStateToProps(state) {
    return {
        sumCatg: state.data.desc.sumCatg,
        filterData: state.data.filterData,
        topShow: state.ui.Top.showTop
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setStartTime: (date) => { dispatch(Actions.setStartTime(date)); },
        setEndTime: (date) => { dispatch(Actions.setEndTime(date)); },
        checkOption: (optValue, optCheck) => { dispatch(Actions.checkOption(optValue, optCheck)); },
        reGetTraces: () => {
            dispatch(Actions.reGetTraces());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps
)(Head)

