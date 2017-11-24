import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './Reducers/Reduers';
import AppLayouts from "./Layout/AppLayouts";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { AppContainer } from 'react-hot-loader';
import {batchActions, enableBatching} from 'redux-batched-actions';

// 利用redux-logger打印日志
//import {createLogger} from 'redux-logger'
// 安装redux-devtools-extension的可视化工具。
//import { composeWithDevTools } from 'redux-devtools-extension'
// 使用日志打印方法， collapsed让action折叠，看着舒服。
//const loggerMiddleware = createLogger({collapsed: true});
require("./app.less");
require("./index.css");
// require("./index.html");
// const configureStore = () => {
//     const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))
//     if (process.env.NODE_ENV !== "production") {
//         if (module.hot) {
//             module.hot.accept('./Reducers/Reduers', () => {
//                 const nextRootReducer = require('./Reducers/Reduers');
//                 store.replaceReducer(nextRootReducer)
//             })
//         }
//     }
//     return store;
// }
// const store = configureStore()
//const store = ;
//
const renderApp = Component => {
    if (process.env.NODE_ENV !== "production") {
    ReactDOM.render(
        <Provider store={createStore(enableBatching(rootReducer), 
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
            applyMiddleware(thunkMiddleware))}>
           <AppContainer>
            <Component />
            </AppContainer>
        </Provider>,
        document.getElementById("app")
    );}else{
        ReactDOM.render(
            <Provider store={createStore(enableBatching(rootReducer), 
                window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
            applyMiddleware(thunkMiddleware))}>
                <Component />
            </Provider>,
            document.getElementById("app")
        );
    }
}

renderApp(AppLayouts)



if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
        module.hot.accept('./Layout/AppLayouts', () => {
            const NextAppLayout = require('./Layout/AppLayouts');
            console.log("$$$$$$$$$$$$");
            renderApp(NextAppLayout)
        })
        //module.hot.accept();
        //renderApp(AppLayouts);
    }
}