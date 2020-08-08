import {
    VALIDATE_RESET_PASSWORD_SUCCESS,
    VALIDATE_RESET_PASSWORD_FAIL,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
} from '../../actions/types';

const INITIAL_STATE = {
    validKey: null,
    email: '',
    error: '',
    reset: false,

}


export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case VALIDATE_RESET_PASSWORD_SUCCESS:
            return {
                ...state, 
                validKey: true, 
                email: action.payload
            };

        case VALIDATE_RESET_PASSWORD_FAIL:
            return { ...state, validKey: false };

        case RESET_PASSWORD_SUCCESS:
            return {
                ...state, 
                error: '', 
                reset: true
            };

        case RESET_PASSWORD_FAIL:
            return {
                ...state, error: action.payload || 'Reset Password Failed!'
            };

        default:
            return state;
    }
}