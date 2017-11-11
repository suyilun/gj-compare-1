import { connect } from 'react-redux'
import React from 'react';
import { Modal } from 'antd';
import * as Actions from '../../Actions/Actions';




const DetailOptionShow = ({ showDetail, showFunc }) => (

    <div className="layer" style={{ display: showDetail ? 'block' : 'none' }}>
        <div className="layer-part">
            <p className="layer-title">
                <span>旅馆信息</span>
                <a onClick={() => { showFunc() }}>
                    <span className="layer-tb"></span>
                    <span className="layer-lr"></span>
                </a>
            </p>
            <div className="s-i-box">
                <div className="s-i-left">
                    <div className="s-i-header">
                        <h1>何恺</h1>
                        <span>330202199203910291</span>
                    </div>
                    <div className="s-i-column">
                        <ul className="s-i-ul">
                            <li><span>性别：</span>男</li>
                            <li><span>生日：</span>1991-09-24</li>
                            <li><span>布控库：</span>逃犯库</li>
                            <li><span>状态：</span>已审核</li>
                            <li><span>申请人姓名：</span>系统管理员</li>
                        </ul>
                        <div className="s-i-remark">
                            <ul className="s-i-ul">
                                <li><span>备注：</span>这是</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="s-i-right">
                    <div className="photo-warp">
                        <img src="images/demo_header.png"></img>
                    </div>
                </div>

            </div>
        </div>
    </div>
);


const TraceModal = ({ showDetail, showFunc }) => {
    return (
        <Modal visible={showDetail} title="ceshiceshi" onCancel={showFunc} footer={null}>
           查看详情
        </Modal>
    );
}
//  <DetailOptionShow showDetail={detailShow} showFunc={showFunc} />

class DetailOption extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { detailShow, showFunc } = this.props;
        return (
            <TraceModal showDetail={detailShow} showFunc={showFunc} />
        );
    }
}


function mapStateToProps(state) {
    return {
        detailShow: state.ui.Detail.showDetail
    }
}

function mapDispatchToProps(dispatch) {
    return {
        showFunc: () => { dispatch(Actions.showDetail(false)) },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DetailOption)
