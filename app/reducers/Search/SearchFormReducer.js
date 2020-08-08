import {
    FETCH_ORIGIN_SUCCESS,
    SET_ORIGIN,
    FETCH_DESTINATION_SUCCESS,
    SET_DESTINATION,
    FETCH_DEPART_DATE_SUCCESS,
    SET_DEPART_DATE,
    FETCH_RETURN_DATE_SUCCESS,
    SET_RETURN_DATE,
    TOGGLE_RETURN_DATE,

    RESTORED_SAVED_SEARCH_SUCCESS,
} from '../../actions/types';

const INITIAL_STATE = {
    originOptions: {},
    destinationOptions: {},
    departDateOptions: {},
    returnDateOptions: {},
    origin: '',
    destination: '',
    departDate: '',
    hasReturnDate: false,
    returnDate: ''
}


export default (state = INITIAL_STATE, action) => {
    const {
        originOptions,
        destinationOptions,
        departDateOptions,
        returnDateOptions,
        origin,
        destination,
        departDate,
        returnDate,
        hasReturnDate        
    } = state;

    switch(action.type) {
        case FETCH_ORIGIN_SUCCESS:
            return {
                ...INITIAL_STATE,
                hasReturnDate,
                originOptions: action.payload
            } 

        case SET_ORIGIN:
            return {
                ...INITIAL_STATE,
                hasReturnDate,
                originOptions,
                origin: action.payload,
            }

        case FETCH_DESTINATION_SUCCESS:
            return {
                ...INITIAL_STATE,
                hasReturnDate,
                originOptions,
                origin,
                destinationOptions: action.payload,           
            }

        case SET_DESTINATION:
            return {
                ...INITIAL_STATE,
                hasReturnDate,
                originOptions,
                origin,
                destinationOptions,
                destination: action.payload,           
            }

        case FETCH_DEPART_DATE_SUCCESS:
            return {
                ...INITIAL_STATE,
                hasReturnDate,
                originOptions,
                origin,
                destinationOptions,
                destination,
                departDateOptions: action.payload,              
            }

        case SET_DEPART_DATE:
            return {
                ...INITIAL_STATE,
                hasReturnDate,
                originOptions,
                origin,
                destinationOptions,
                destination,
                departDateOptions,
                departDate: action.payload,
            }

        case FETCH_RETURN_DATE_SUCCESS:
            return {
                ...INITIAL_STATE,
                hasReturnDate,
                originOptions,
                origin,
                destinationOptions,
                destination,
                departDateOptions,
                departDate,
                returnDateOptions: action.payload,               
            }

        case SET_RETURN_DATE:
            return {
                ...INITIAL_STATE,
                hasReturnDate,
                originOptions,
                origin,
                destinationOptions,
                destination,
                departDateOptions,
                departDate,
                returnDateOptions,
                returnDate: action.payload,
            }

        case TOGGLE_RETURN_DATE:
            return {
                ...state,
                returnDate: INITIAL_STATE.returnDate,
                hasReturnDate: action.payload,
            }

        case RESTORED_SAVED_SEARCH_SUCCESS:
            return {
                ...action.payload
            }
            
        default:
            return state;
    }
}