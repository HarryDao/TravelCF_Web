import axios from 'axios';
import LS from '../../services/LocalStorage';
import { ROUTE_USER } from '../routes';
import {
    FETCH_SEARCH_HISTORY_SUCCESS,
    SAVE_NEW_SEARCH_SUCCESS,
} from '../types';


export const fetchUserSearchHistory = (cb) => async dispatch => {
    try {
        let { data: { searches, cities } } = await axios.get(
            ROUTE_USER.USER_SEARCH_HISTORY,
            LS.CreateAuthHeader()
        );

        dispatch({
            type: FETCH_SEARCH_HISTORY_SUCCESS, 
            payload: { searches, cities }
        });

        return cb();
    }
    catch(err) {
        // console.error(`Error fetchUserSearchHistory: ${err}`); 
        return cb();
    }
}


export const saveUserNewSearch = ({
    origin, destination, departDate, returnDate, props, state
}) => async dispatch => {

    try {
        let { data: { searches, cities } } = await axios.post(
            ROUTE_USER.USER_SEARCH_HISTORY,
            { origin, destination, departDate, returnDate, props, state },
            LS.CreateAuthHeader()
        );

        dispatch({
            type: SAVE_NEW_SEARCH_SUCCESS,
            payload: { searches, cities }
        });
    }
    catch(err) {
        // console.error(`Error saveUserNewSearch: ${err}`);
    }
}