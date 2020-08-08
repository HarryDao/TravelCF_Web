import {
    FETCH_DEPART_TRIP_SUCCESS,
    FETCH_RETURN_TRIP_SUCCESS,
} from '../../actions/types';

const INITIAL_STATE = {
    departTrip: [],
    returnTrip: [],
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_DEPART_TRIP_SUCCESS:
            return {
                ...state,
                departTrip: action.payload,
            }

        case FETCH_RETURN_TRIP_SUCCESS:
            return {
                ...state,
                returnTrip: action.payload,
            }
            
        default:
            return state;
    }
}