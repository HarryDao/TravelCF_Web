const Express = require('express');
const Router = Express.Router();
const Passport = require('passport');

require('../services/passport');
const UserController = require('../controller/user');

const requireLogin = Passport.authenticate('local', { session: false });
const requireAuth = Passport.authenticate('jwt', { session: false });

Router.get('/oauth/google/url', (req, res) => {
    UserController.GenerateOAuthGoogleURL((url) => {
        return res.status(200).json({ url });
    });
});

Router.post('/oauth/google/login', (req, res) => {
    const { code, idToken } = req.body;
    UserController.LoginWithOauthGoogle({ code, idToken }, (err, data) => {

        if (err) {
            console.error(`Error LoginWithOauthGoogle: ${err}`);

            return res.status(422).send({ Error: err });
        }

        res.status(200).send(data);

    })
})

Router.post('/register', (req, res, next) => {
    const { email, password, onMobile } = req.body;

    UserController.Register({ email, password, onMobile }, err => {

        if (err){
            console.error(`Error Register: ${err}`);

            return res.status(err.code).json({ error: err.err });
        }

        res.sendStatus(200);
    });
});


Router.post('/activate', (req, res, next) => {
    const { key, email } = req.body;

    UserController.Activate({ key, email }, err => {

        if (err){
            console.error(`Error Activate: ${err}`);

            return res.sendStatus(403);
        }

        return res.sendStatus(200);
    });
});


Router.post('/login', requireLogin, (req, res) => {
    const { user } = req;
    
    UserController.Login(user, ({ token, email }) => {
        return res.status(200).send({ token, email })
    });
});


Router.post('/request-reset-password', (req, res) => {
    const { email, onMobile } = req.body;

    UserController.RequestResetPassword({ onMobile, email }, err => {

        if (err) {
            console.error(`Error RequestResetPassword: ${err}`);
        }

        return res.status(200).json({ ok: true });
    });
});

Router.post('/validate-reset-password-link', (req, res) => {
    const { key } = req.body;

    UserController.ValidateResetLink({ key }, (err, email) => {

        if (err) {
            console.error(`Error ValidateResetLink: ${err}`);

            return res.status(403).send({ error: err });
        }
        
        return res.status(200).send({ email });
    })
});

Router.post('/reset-password', (req, res) => {
    const { email, password, key } = req.body;

    UserController.ResetPassword({ email, password, key }, err => {

        if (err){
            console.error(`Error ResetPassword: ${err}`);

            return res.status(500).send({ error: err });
        }
        
        return res.status(200).json({ ok: true });
    });
});

Router.get('/searches', requireAuth, (req, res) => {
    const { user } = req;

    UserController.GetSearches({ user }, true, (err, searches, cities) => {
        
        if (err) {
            console.error(`Error GetSearches: ${err}`);

            if (err.code && err.message) {
                return res.status(err.code).send({ error: err.message });
            }
            return res.status(500).send({ error: err });
        }

        return res.status(200).send({ searches, cities });
    });
});

Router.post('/searches', requireAuth, (req, res) => {
    const { user } = req;
    const { origin, destination, departDate, returnDate, props, state } = req.body;

    UserController.SaveSearch({ user, origin, destination, departDate, returnDate, props, state }, (err, searches, cities) => {

        if (err) {
            console.error(`Error SaveSearch: ${err}`);
        
            if (err.code && err.message) {
                return res.status(err.code).send({ error: err.message });
            }
            return res.status(500).send({ error: err });
        }

        return res.status(200).send({ searches, cities });
    });
    
});

module.exports = Router;
