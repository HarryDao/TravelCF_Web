import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import PageNavReducer from './PageNavReducer';
import LoginReducer from './Auth/LoginReducer';
import ResetPasswordReducer from './Auth/ResetPasswordReducer';
import SearchFormReducer from './Search/SearchFormReducer';
import SearchResultReducer from './Search/SearchResultReducer';
import SearchHistoryReducer from './Search/SearchHistoryReducer';


export default combineReducers({
    form: formReducer,
    nav: PageNavReducer,
    auth: combineReducers({
        login: LoginReducer,
        resetPassword: ResetPasswordReducer,
    }),
    search: combineReducers({
        searchForm: SearchFormReducer,
        searchResult: SearchResultReducer,
        searchHistory: SearchHistoryReducer,
    }),
});