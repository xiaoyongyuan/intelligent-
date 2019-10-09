import { combineReducers } from 'redux';
import * as type from '../action/type';

const handleData = (state = {isFetching: true, data: {}, active:{}}, action) => {
    switch (action.type) {
        case type.REQUEST_DATA:
            return {...state, isFetching: true};
        case type.RECEIVE_DATA:
            return {...state, isFetching: false, data: action.data};            
        default:
            return {...state};
    }
};
const httpData = (state, action) => {
    switch (action.type) {
        case type.RECEIVE_DATA:
        case type.REQUEST_DATA:
            return {
                ...state,
                [action.category]: handleData(state[action.category], action)
            };
        case type.CHANGE_COMP:
        case type.ALARM_MAX:
            const data= state[action.category];
            data[action.value]=action.data;
            return  {[action.category]: data};
        case type.CLEAR_ANTD:
            const auth= state[action.category];
            auth.data={};
            auth.active={};
            return  {[action.category]: auth};
        default:
            return {...state};
    }
};

export default combineReducers({
    httpData
});
