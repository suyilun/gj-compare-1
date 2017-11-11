import {combineReducers} from 'redux';

import ui from './Reduer_ui';
import data from './Reduer_data';


//combinReducers是将以上方法做融合绑定
export default combineReducers({
    data,
    ui,
})