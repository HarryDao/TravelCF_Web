const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';

module.exports = {
    PORT: 3000,
    PUBLIC_PATH: PUBLIC_PATH,
    SERVER_URL: PUBLIC_PATH === '/' ? '' : PUBLIC_PATH,
    // SERVER_URL: 'http://localhost:3101',
    PAGES: {
        home: {
            path: `${PUBLIC_PATH}/`,
            navName: 'Home',
        },
        login: {
            path: `${PUBLIC_PATH}/user/login`,
            navName: 'Login'
        },
        activation: {
            path: `${PUBLIC_PATH}/user/activation`,
            shortPath: '/user/activation',
        },
        forgotPassword: {
            path: `${PUBLIC_PATH}/user/forgot-password`,
        },
        resetPassword: {
            path: `${PUBLIC_PATH}/user/reset-password`,
        },
        oAuthGoogle: {
            path: `${PUBLIC_PATH}/user/oauth/google`,
        },
        oAuthFacebook: {
            path: `${PUBLIC_PATH}/user/oauth/facebook`
        },
        search: {
            path: `${PUBLIC_PATH}/search`
        },
    },
    MIN_FETCH_DURATION: 1000,
    TOGGLE_SHOW_TIMEOUT: 300,
};