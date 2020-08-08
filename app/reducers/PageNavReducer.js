import {
    PAGE_NAV_CHANGED
} from '../actions/types';

const INITIAL_STATE = 'home'


export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case PAGE_NAV_CHANGED:
            return action.payload;
            
        default:
            return state;
    }
}