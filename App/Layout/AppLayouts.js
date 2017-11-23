import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import Main from "../Component/Main/Main"
import React from 'react';

//简单单页面
const AppLayout = () => {
    return (
        <Router>
            <Switch>
                <Route  exact path='/' component={Main} />
                <Route path='/main/:userNumbers' component={Main}/> 
            </Switch>
        </Router>
    );
}
module.exports = AppLayout