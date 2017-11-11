import {connect} from 'react-redux'
import React from 'react';
import * as Actions from '../../Actions/Actions';

const HandleShow = ({show,func}) => (
    <a href="javascript:;" className="slide-top" onClick={()=>{func(show)}}>
        <span></span>
        <span></span>
        <span></span>
    </a>
);

class Handle extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {isShowTop,showFunc} = this.props;
    return (
        <HandleShow show={isShowTop} func={showFunc}/>
    );
  }
}


function mapStateToProps(state) {
    return {
        isShowTop:state.ui.Top.showTop
    }
}

function mapDispatchToProps(dispatch) {
    return{
        showFunc:(date)=>{dispatch(Actions.showTop(date))},
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Handle)
