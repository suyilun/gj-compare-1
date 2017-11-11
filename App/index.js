import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './Reducers/Reduers';
import AppLayouts from "./Layout/AppLayouts";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { AppContainer } from 'react-hot-loader';
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
        <Provider store={createStore(rootReducer, applyMiddleware(thunkMiddleware))}>
           <AppContainer>
            <Component />
            </AppContainer>
        </Provider>,
        document.getElementById("app")
    );}else{
        ReactDOM.render(
            <Provider store={createStore(rootReducer, applyMiddleware(thunkMiddleware))}>
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