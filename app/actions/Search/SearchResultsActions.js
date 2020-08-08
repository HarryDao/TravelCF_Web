import axios from 'axios';
import LS from '../../services/LocalStorage';
import { ROUTE_SEARCH } from '../routes';
import {
    FETCH_DEPART_TRIP_SUCCESS,
    FETCH_RETURN_TRIP_SUCCESS,
} from '../types';


export const fetchDepartTrip = ({ origin, destination, departDate }, cb) => async dispatch => {
    try {
        let { data } = await axios.post(
            ROUTE_SEARCH.FETCH_TRIPS,
            { origin, destination, time: departDate },
            LS.CreateAuthHeader()
        );

        dispatch({ type: FETCH_DEPART_TRIP_SUCCESS, payload: data });

        return cb();
    }
    catch(err) {
        // console.error(`Error fetchDepartTrip: ${err}`);
    }
}


export const fetchReturnTrip = ({ origin, destination, returnDate }, cb) => async dispatch => {
    try {
        let { data } = await axios.post(
            ROUTE_SEARCH.FETCH_TRIPS,
            {
                origin: destination,
                destination: origin,
                time: returnDate
            },
            LS.CreateAuthHeader()
        );

        dispatch({ type: FETCH_RETURN_TRIP_SUCCESS, payload: data });

        return cb();
    }
    catch(err) {
        // console.error(`Error fetchReturnTrip: ${err}`);
    }
}