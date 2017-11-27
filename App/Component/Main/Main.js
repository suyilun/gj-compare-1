import React from 'react';
import Head from '../Home/Top'
import Content from '../Home/Content'

class Main extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const {match}=this.props;
        const {userNumbers}=match.params;
       // const {userNumbers}=this.props.params;
        //console.log("userNumbers",userNumbers)
        return (
            <div>
                <Head key="gj-head"/>
                <Content key="gj-content" userNumbers={userNumbers}/>
            </div>
        )
    }
}
export default Main




