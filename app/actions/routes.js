import { SERVER_URL } from '../../configs/app';

export const ROUTE_USER = {
    LOGIN: `${SERVER_URL}/api/user/login`,
    REGISTER: `${SERVER_URL}/api/user/register`,
    ACTIVATE: `${SERVER_URL}/api/user/activate`,
    
    REQUEST_RESET_PASSWORD: `${SERVER_URL}/api/user/request-reset-password`,
    VALIDATE_RESET_PASSWORD_LINK: `${SERVER_URL}/api/user/validate-reset-password-link`,
    RESET_PASSWORD: `${SERVER_URL}/api/user/reset-password`,

    GENERATE_OAUTH_GOOGLE_URL: `${SERVER_URL}/api/user/oauth/google/url`,
    LOGIN_WITH_OAUTH_GOOGLE: `${SERVER_URL}/api/user/oauth/google/login`,

    USER_SEARCH_HISTORY: `${SERVER_URL}/api/user/searches`
}

export const ROUTE_SEARCH = {
    FETCH_ORIGIN: `${SERVER_URL}/api/search/airport/origin`,
    FETCH_DESTINATION: `${SERVER_URL}/api/search/airport/destination`,
    FETCH_DATE: `${SERVER_URL}/api/search/date/available`,

    FETCH_TRIPS: `${SERVER_URL}/api/search/trips`,
}
