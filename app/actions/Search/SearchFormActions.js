import axios from 'axios';
import LS from '../../services/LocalStorage';
import { ROUTE_SEARCH } from '../routes';
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
} from '../types';


export const fetchOrigin = () => async dispatch => {
    try {
        let { data } = await axios.get(
            ROUTE_SEARCH.FETCH_ORIGIN, 
            LS.CreateAuthHeader()
        );

        dispatch({ type: FETCH_ORIGIN_SUCCESS, payload: data });
    }
    catch(err) {
        // console.error(`Error fetchOrigin: ${err}`);
    }
}


export const setOrigin = ({ origin }) => {
    return { type: SET_ORIGIN, payload: origin };
}


export const fetchDestination = ({ origin }) => async dispatch => {
    try {
        let { data } = await axios.post(
            ROUTE_SEARCH.FETCH_DESTINATION,
            { origin },
            LS.CreateAuthHeader()
        );

        dispatch({ type: FETCH_DESTINATION_SUCCESS, payload: data });
    }
    catch(err) {
        // console.error(`Error fetchDestination: ${err}`);
    }
}


export const setDestination = ({ destination }) => {
    return { type: SET_DESTINATION, payload: destination };
}


export const fetchDepartDate = ({ origin, destination }) => async dispatch => {
    try {   
        let { data } = await axios.post(
            ROUTE_SEARCH.FETCH_DATE,
            { origin, destination },
            LS.CreateAuthHeader(),
        );

        dispatch({ type: FETCH_DEPART_DATE_SUCCESS, payload: data });
    }
    catch(err) {
        // console.error(`Error fetchDepartDate: ${err}`);
    }
}


export const setDepartDate = ({ departDate }) => {
    return { type: SET_DEPART_DATE, payload: departDate };
}


export const fetchReturnDate = ({ origin, destination, departDate }) => async dispatch => {
    try {
        let { data } = await axios.post(
            ROUTE_SEARCH.FETCH_DATE,
            {
                origin: destination,
                destination: origin,
                min: departDate
            },
            LS.CreateAuthHeader()
        );

        dispatch({ type: FETCH_RETURN_DATE_SUCCESS, payload: data });
    }
    catch(err) {
        // console.error(`Error fetchReturnDate: ${err}`);
    }
}

export const setReturnDate = ({ returnDate }) => {
    return { type: SET_RETURN_DATE, payload: returnDate };
}


export const toggleReturnDate = (on = true) => {
    return { type: TOGGLE_RETURN_DATE, payload: on === true };
}


export const restoreSavedSearch = (props) => {
    return { type: RESTORED_SAVED_SEARCH_SUCCESS, payload: props };
}
