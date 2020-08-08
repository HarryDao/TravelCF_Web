import {
    FETCH_SEARCH_HISTORY_SUCCESS,
    SAVE_NEW_SEARCH_SUCCESS,
} from '../../actions/types';

const INITIAL_STATE = {
    searches: [],
    cities: {},
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_SEARCH_HISTORY_SUCCESS:
            return {
                ...state, 
                searches: action.payload.searches, 
                cities: action.payload.cities
            }

        case SAVE_NEW_SEARCH_SUCCESS:
            return {
                ...state, 
                searches: action.payload.searches, 
                cities: action.payload.cities
            }
            
        default: 
            return state;
    }
}