import {
    RESET_AUTH_FORM,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    ACTIVATE_SUCCESS,
    ACTIVATE_FAIL,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
} from '../../actions/types';

const INITIAL_STATE = {
    error: '',
    message: '',
    activated: null,
    authenticated: false,
    email: '',
};


export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case RESET_AUTH_FORM:
            return INITIAL_STATE;

        case LOGIN_SUCCESS:
            return {
                ...INITIAL_STATE, 
                authenticated: true, 
                email: action.payload
            };

        case LOGIN_FAIL:
            return { ...state, error: 'Login failed!' }

        case LOGOUT_SUCCESS:
            return INITIAL_STATE;

        case REGISTER_SUCCESS:
            return {
                ...INITIAL_STATE, 
                error: '', 
                message: 'Successful! A verification email has been sent to your account.'
            }

        case REGISTER_FAIL:
            return {
                ...state, 
                error: action.payload || 'Registration failed!'
            }

        case ACTIVATE_SUCCESS:
            return { ...INITIAL_STATE, activated: true }

        case ACTIVATE_FAIL:
            return { ...state, activated: false }
            
        default: 
            return state;
    }
}


