import axios from 'axios';
import LS from '../../services/LocalStorage';
import { ROUTE_USER } from '../routes';
import {
    RESET_AUTH_FORM,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    ACTIVATE_SUCCESS,
    ACTIVATE_FAIL,
} from '../types';


export const resetForm = () => {
    return { type: RESET_AUTH_FORM };
}


export const loginUser = ({ email, password }, cb, cbOnError) => async dispatch => {
    try {
        dispatch({ type: RESET_AUTH_FORM });

        let { data } = await axios.post(ROUTE_USER.LOGIN, { email, password });

        LS.SetToken(data.token, data.email);

        dispatch({ type: LOGIN_SUCCESS, payload: data.email });
        
        return cb();
    }
    catch(err) {
        // console.error(`Error loginUser: ${err}`);
        authFail(dispatch, err, LOGIN_FAIL, cbOnError);
    }
}


export const logoutUser = () => {
    return (dispatch) => {
        
        LS.RemoveToken();

        dispatch({ type: LOGOUT_SUCCESS });
    }
}


export const registerUser = ({ email, password }, cb, cbOnError) => async dispatch => {
    try {
        dispatch({ type: RESET_AUTH_FORM });

        await axios.post(ROUTE_USER.REGISTER, { email, password })

        dispatch({ type: REGISTER_SUCCESS });

        return cb();
    }
    catch(err) {
        // console.error(`Error registerUser: ${err}`);
        authFail(dispatch, err, REGISTER_FAIL, cbOnError);
    } 
}


export const activateUser = ({ key }, cb) => async dispatch => {
    try {
        await axios.post(ROUTE_USER.ACTIVATE, { key });

        dispatch({ type: ACTIVATE_SUCCESS });
    }
    catch(err) {
        // console.error(`Error activating user: ${err}`);
        dispatch({ type: ACTIVATE_FAIL });
    }
}



export const generateOAuthGoogleURL = (cb) => async () => {
    try {
        let { data: { url } } = await axios.get(ROUTE_USER.GENERATE_OAUTH_GOOGLE_URL);
        return cb(null, url);
    } 
    catch(err) {
        // console.error(`Error generatingOAuthGoogleURL: ${err}`);
        return cb(err);
    } 
}


export const loginWithOAuthGoogle = (code, cb) => async dispatch => {
    try {
        let { data: { email, token } } = await axios.post(
            ROUTE_USER.LOGIN_WITH_OAUTH_GOOGLE,
            { code }
        );

        LS.SetToken(token, email);

        dispatch({ type: LOGIN_SUCCESS, payload: email });

        return cb();
    }
    catch(err) {
        // console.error(`Error loginWithOAuthGoogle: ${err}`);
        return cb(err);
    }
}


const authFail = (dispatch, err, type, cbOnError) => {
    let message = null;

    if (err && err.response && err.response.data && err.response.data.error){
        message = err.response.data.error;
    }

    dispatch({ type, payload: message });

    if (cbOnError && typeof cbOnError === 'function' ) {
        return cbOnError();
    }
}