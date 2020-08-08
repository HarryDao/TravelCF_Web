module.exports = {
    PORT: 80,
    SERVER_URL: '',
    // SERVER_URL: 'http://localhost:3101',
    PAGES: {
        home: {
            path: '/',
            navName: 'Home',
        },
        login: {
            path: '/user/login',
            navName: 'Login'
        },
        activation: {
            path: '/user/activation',
        },
        forgotPassword: {
            path: '/user/forgot-password',
        },
        resetPassword: {
            path: '/user/reset-password',
        },
        oAuthGoogle: {
            path: '/user/oauth/google'
        },
        oAuthFacebook: {
            path: '/user/oauth/facebook'
        },
        search: {
            path: '/search'
        },
    },
    MIN_FETCH_DURATION: 1000,
    TOGGLE_SHOW_TIMEOUT: 300,
};