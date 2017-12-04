import * as Actions from '../../Actions/Actions';
import React from 'react';
import { connect } from 'react-redux'

const PeopleShow = ({ pname, cancel, userNumber }) => (
    <li className={"userPic"}>
        <p>
            {/*<img src="images/demo_header.png"></img>*/}
            <img src={`${__ENV__.picPath}${userNumber}`}></img>
            <strong>{pname}</strong>
        </p>
        <a href={`${__ENV__.dakPath}${userNumber}`} target="_blank">{userNumber}</a>
        <i onClick={() => { cancel(userNumber) }}>
            <span className="life-tb"></span>
            <span className="life-lr"></span>
        </i>
    </li>
)

class PeoplePic extends React.Component {

    constructor(props) {
        super(props);
        console.log("people头像初始化：", props);// count: 0, text: undefined, user: undefined
    }

    render() {
        let { pname, cancel, userNumber } = this.props;
        console.log("开始渲染People")
        return (
            <PeopleShow pname={pname}
                userNumber={userNumber}
                cancel={cancel}
            />
        );
    }
}
function mapStateToProps() {
    return {

    }
}
function mapDispatchToProps(dispatch) {
    return {
        cancel: (data) => {
            console.log("data---", data);
            dispatch(Actions.dataCancel(data))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PeoplePic)
