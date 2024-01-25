import {createStore,combineReducers,applyMiddleware} from "redux"
import {thunk} from "redux-thunk"
import userReducer from "../Reducers/userReducer"
import walletReducer from "../Reducers/walletReducer"
import notificationReducer from "../Reducers/notificationReducers"


const configstore = () =>{
    const store = createStore(combineReducers({
        user : userReducer,
        wallet : walletReducer,
        notification : notificationReducer
    }),applyMiddleware(thunk))
    return store
}
 
export default configstore