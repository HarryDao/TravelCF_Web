import axios from 'axios';
import { ROUTE_USER } from '../routes';
import {
    VALIDATE_RESET_PASSWORD_SUCCESS,
    VALIDATE_RESET_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
} from '../types';


export const requestResetPassword = ({ email }, cb) => async () => {
    try {
        await axios.post(ROUTE_USER.REQUEST_RESET_PASSWORD, { email });
        
        return cb()
    }
    catch(err) {
        // console.error(`Error requestResetPassword ${err}`);
        return cb()
    }
}


export const validateResetPasswordLink = ({ key }) => async dispatch => {
    try {
        let response = await axios.post(ROUTE_USER.VALIDATE_RESET_PASSWORD_LINK, { key });

        dispatch({
            type: VALIDATE_RESET_PASSWORD_SUCCESS,
            payload: response.data.email
        });
    }
    catch(err) {
        // console.error(`Error validateResetPasswordLink: ${err}`);
        dispatch({ type: VALIDATE_RESET_PASSWORD_FAIL });
    }
}


export const resetPassword = ({ email, password, key }) => async dispatch => {
    try {
        await axios.post(ROUTE_USER.RESET_PASSWORD, { email, password, key });

        dispatch({ type: RESET_PASSWORD_SUCCESS });
    }
    catch(err) {
        // console.error(`Error resetPassword: ${err}`);
        authFail(dispatch, err, RESET_PASSWORD_FAIL);
    }
}


const authFail = (dispatch, err, type) => {
    let message = null;

    if (err && err.response && err.response.data && err.response.data.error){
        message = err.response.data.error;
    }

    dispatch({ type, payload: message });
}