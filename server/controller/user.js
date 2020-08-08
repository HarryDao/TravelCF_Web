const bcrypt = require('bcrypt-nodejs');
const jwt = require('jwt-simple');

const Postgres = require('./');
const SearchController = require('./search');
const Email = require('./email');
const OAuthGoogle = require('../helpers/OAuthGoogle');
const UserQueries = require('./queries/user');

const {
    FRONT_APP_URL, 
    JWT: { SECRET, TOKEN_ID_LENGTH }, 
    OAUTH_GOOGLE
} = require('../../configs/server');
const { MAX_SAVED_SEARCHES } = require('../../configs/server');
const { PAGES } = require('../../configs/app');

const encodeText = (text) => {
    text = text || '';
    return text.replace(/\'/g, '%%&&%%');
}

const decodeText = (text) => {
    text = text || '';
    return text.replace(/\%\%\&\&\%\%/g, '\'');
}


class User extends Postgres {
    constructor() {
        super();

        this.Register = this.Register.bind(this);
        this.Activate = this.Activate.bind(this);
        this.RequestResetPassword = this.RequestResetPassword.bind(this);
        this.ValidateResetLink = this.ValidateResetLink.bind(this);
        this.ResetPassword = this.ResetPassword.bind(this);
        this.Login = this.Login.bind(this);
        this.ComparePassword = this.ComparePassword.bind(this);
        this.GenerateOAuthGoogleURL = this.GenerateOAuthGoogleURL.bind(this);
        this.LoginWithOauthGoogle = this.LoginWithOauthGoogle.bind(this);
        this.SaveSearch = this.SaveSearch.bind(this);
        this.GetSearches = this.GetSearches.bind(this);
        this._FindExistingUser = this._FindExistingUser.bind(this);
        this._CreateTokenId = this._CreateTokenId.bind(this);
    }

    async Register({ email, password, onMobile }, cb) {
        try {
            if (!this.ValidateEmailAndPassword(email, password)){
                return cb({
                    code: 403,
                    err: `Invalid Email or Password`
                });
            }
            email = email.toLowerCase();

            const client = await this.CreateClient();
            const existingUser = await this._FindExistingUser(client, email);

            if (existingUser){
                return cb({
                    code: 403,
                    err: 'Email already register!',
                });
            }

            const tokenId = await this._CreateTokenId(client);
            const key = onMobile ? this._CreateConfirmCode() : await this._GenerateHash(`${tokenId}${new Date()}`);
            
            const { err } = await this.Query(client, UserQueries.createUser(
                email,
                await this._GenerateHash(password),
                tokenId,
                key
            ));

            if (err) {
                throw err;
            }


            this._SendRegisterEmail(onMobile, key, email);
            this.CloseClient(client);
            
            return cb();
        }
        catch(err){
            console.error(`Error With Signing Up: ${err}`);

            return cb({
                code: 500,
                err: `Something went wrong!`
            });
        }
    }

    async Activate({ key, email }, cb) {
        try {
            if (email) { email = email.toLowerCase(); }

            const client = await this.CreateClient();
            const { rows } = await this.Query(client, UserQueries.findByKey({ key, email }));
    
            if (!rows || !rows[0]){
                return cb(`Invalid Link!`);
            }

            const { err: updateErr, rowCount } = await this.Query(client, UserQueries.activateUser({
                email: rows[0].email
            }));

            if (updateErr || !rowCount){
                console.error(`User-Activate error: ${err}, rowCount: ${rowCount}`);
                return cb(`Error with Activate`);
            }

            this.CloseClient(client);
            return cb();
        }
        catch(err){
            console.error('Error Activate:', err);

            return cb(`Something went wrong!`);
        }

    }

    async RequestResetPassword({ onMobile, email }, cb) {
        try {
            if (!email) {
                return cb(`Invalid email!`);
            }

            email = email.toLowerCase();
            const client = await this.CreateClient();

            const { rows } = await this.Query(client, UserQueries.findByEmail({ email }));

            if (!rows || !rows[0] || !rows[0].token_id){
                return cb(`Account not found!`);
            }

            if (!rows[0].activated){
                return cb(`Account not activated`);
            }

            const user = rows[0];

            let key;
            if (onMobile) {
                key = this._CreateConfirmCode();
            }
            else {
                key = await this._GenerateHash(`${user.token_id}${new Date()}`);
            }

            const { err, rowCount } = await this.Query(client, UserQueries.updateUser({
                set: `key = '${key}'`,
                where: `email = '${user.email}'`,
            }));

            if (err || !rowCount) {
                console.error(`Error RequestResetPassword: ${err}, rowCount: ${rowCount}`);
                return cb(`Something went wrong!`);
            }

            this._SendResetPasswordEmail(onMobile, key, user.email);
            this.CloseClient(client);

            return cb();
        }   
        catch(err) {
            return cb(err);
        }     
    }

    ValidateResetLink ({ key, email }, cb) {
        if (!key) { return cb(`Invalid Key`); }    

        if (email) { email = email.toLowerCase(); }

        this.QuickQueryWithCB(UserQueries.findByKey({ key, email }), [], ({ err, rows }) => {
            if (err){ return cb(err); }

            if (!rows || !rows[0] || !rows[0].email){
                return cb(`User not found`);
            }

            return cb(null, rows[0].email);
        });
    }

    async ResetPassword({ email, password, key }, cb) {
        try {
            if (!email || !password || !key) {
                return cb(`Something went wrong!`);
            }
            
            email = email.toLowerCase();
            password = await this._GenerateHash(password);
    
            const { err, rowCount } = await this.QuickQuery(UserQueries.updateUser({
                set: `password='${password}', key=''`,
                where: `email='${email}' AND key='${key}'`,
            }), []);

            if (err || !rowCount) {
                console.error(`Reset Password error: ${err}, rowCount: ${rowCount}`);

                return cb(`Something went wrong!`);
            }
            
            return cb();
        }
        catch(err){
            console.error('Error ResetPassword:', err);

            return cb(err);
        }
    }

    Login(user, cb) {
        const { email, token_id } = user;

        return cb({
            token: this._CreateToken(token_id),
            email
        });
    }

    ComparePassword(input, password, cb){
        bcrypt.compare(input, password, (err, isMatch) => {
            return cb(err, isMatch);
        });
    }

    GenerateOAuthGoogleURL(cb) {
        return cb(OAuthGoogle.getURL());
    }

    async LoginWithOauthGoogle({ code, idToken }, cb) {
        try {
            const email = idToken ? 
                        await OAuthGoogle.verifyIdToken(idToken) :
                        await OAuthGoogle.login(code);
            if (!email) {
                throw 'Invalid Token'
            }

            let loginInfo;
            const existingUser = await this._FindExistingUser(null, email);

            if (existingUser) {
                loginInfo = existingUser;
            }
            else {

                const token_id = await this._CreateTokenId();
                
                let { err, rowCount } = await this.QuickQuery(UserQueries.createUser(
                    email,
                    OAUTH_GOOGLE.DEFAULT_PASSWORD,
                    token_id,
                    '',
                    '',
                    true
                ));

                if (err || !rowCount) { throw err || 'No Row Created!'} 
                
                loginInfo = { email, token_id };
            }

            this.Login(loginInfo, ({ token }) => {
                return cb(null, { email, token });
            });

        }
        catch(err) {
            console.error('Error LoginWithOauthGoogle:', err);

            return cb('Invalid!');
        }
    }


    GetSearches({ user }, withCityDescription, cb) {
        if (!user || !user.email) {
            return cb({
                code: 401,
                message: 'User Not Found',
            });
        }

        this.QuickQueryWithCB(UserQueries.findByEmail(
            { email: user.email }), 
            [], 
            ({ err, rows }) => {
                if (err) { return cb(err); }
                let searches = [];

                if (rows && rows.length > 0) {
                    try {
                        searches = rows[0].searches ? JSON.parse(decodeText(rows[0].searches)) : [];
                    }
                    catch(err) {
                        return cb(err);
                    }
                }

                if (!withCityDescription) {
                    return cb(null, searches);
                }

                let cities = [];
                searches.map(search => {
                    if (cities.indexOf(search.origin) === -1) {
                        cities.push(search.origin);
                    }
                    if (cities.indexOf(search.destination) === -1) {
                        cities.push(search.destination);
                    }
                });
                SearchController.GetCityDescription(cities, (err, cities) => {
                    return cb(err, searches, cities);
                });
            }
        );
    }

    SaveSearch({ user, origin, destination, departDate, returnDate, props, state }, cb) {
        if (!user || !origin || !destination || !departDate) {
            return cb({
                code: 403,
                message: 'Invalid Inputs'
            });
        }

        const newSearch = {
            origin, 
            destination, 
            departDate, 
            props, 
            state, 
            time: new Date().getTime()
        }

        if (returnDate) {
            newSearch.returnDate = returnDate;
        }

        this.GetSearches({ user }, false, (err, searches) => {
            if (err) { return cb(err); }

            searches = searches.filter(search => {
                return search.origin === newSearch.origin &&
                        search.destination === newSearch.destination ?
                        false: true;
            });
            searches = searches.sort((a, b) => b.time > a.time ? 1 : -1);
            searches.unshift(newSearch);
            searches = searches.slice(0, MAX_SAVED_SEARCHES);

            let cities = [];
            searches.map(search => {
                if (cities.indexOf(search.origin) === -1) {
                    cities.push(search.origin);
                }
                if (cities.indexOf(search.destination) === -1) {
                    cities.push(search.destination);
                }
            });

            this.QuickQueryWithCB(
                UserQueries.updateUser({
                    set: `searches='${encodeText(JSON.stringify(searches))}'`,
                    where: `email='${user.email}'`
                }), 
                [], 
                ({ err, rowCount }) => {
                    if (err) { return cb(err); }
                    if (!rowCount) { return cb(`Cant Update Searches!`); }

                    SearchController.GetCityDescription(cities, (err, cities) => {
                        return cb(err, searches, cities);
                    });
                }
            );

        });
    }

    _CreateToken(tokenId) {
        return jwt.encode({
            sub: tokenId,
            iat: new Date().getTime()
        }, SECRET);
    }


    async _CreateTokenId(client) { 
        try {
            const isNewConnection = client ? false : true;
            if (isNewConnection) {
                client = await this.CreateClient();
            }

            let id;
            let found = false;
            let attempts = 0;

            do {
                attempts ++;
                id = '';
                for (let i = 0; i < TOKEN_ID_LENGTH; i ++){
                    id += String.fromCharCode(Math.random() * (117 - 48) + 48);
                }

                const { rows }  = await this.Query(client, UserQueries.findByTokenId({ id }));

                if (rows && rows.length === 0){
                    found = true;
                }
                
            }
            while (!found && attempts < 100);

            if (isNewConnection) {
                this.CloseClient(client);
            }

            if (!found){
                console.error(`Cant find a unique token after ${attempts} attempts`);
                throw `Create Token Failed!`;
            }
            
            return id;

        }
        catch(err){
            console.error(`Error CreateTokenId: ${err}`);

            throw 'Create Token Failed!';
        }      
    }

    ValidateEmailAndPassword(email, password) {
        if (!email || !password || typeof email != 'string' || typeof password != 'string'){
            return false;
        }
        if (email.indexOf('@') === -1){
            return false;
        }

        if (password.length < 6 || 
            !/[A-Z]/.test(password) || 
            !/[a-z]/.test(password) || 
            !/[0-9]/.test(password)){
            return false;
        }

        return true;
    }

    async _FindExistingUser(client, email){
        try {
            const isNewConnection = client ? false : true;
            if (isNewConnection) {
                client = await this.CreateClient();
            }

            const { rows } = await this.Query(client, UserQueries.findExistingUser({ email }));

            if (rows && rows.length > 0 ){
                if (isNewConnection) {
                    this.CloseClient(client);
                }
                return rows[0];
            }

            await this.Query(client, UserQueries.removeUnactivatedUserIfExists({ email }));

            if (isNewConnection) {
                this.CloseClient(client);
            }

            return false;
        }
        catch(err){
            console.error(`Error CheckDuplicateEmail - ${err}`);
            
            return false;
        }
    }


    _CreateConfirmCode() {
        const CODE_LENGTH = 6;
        let code = '';

        for (let i = 0; i < CODE_LENGTH; i ++) {
            code += Math.floor(Math.random() * 10);
        }

        return code;
    }

    _SendRegisterEmail(onMobile, key, email) {
        let html, subject;

        if (onMobile) {
            subject = `${key} is your TravelCF confirmation code`;
            html = `
                <p>Thank you for your registration with TravelCF</p>
                <p>Your confirmation code is ${key}</p>
                <p>Thank you</p>
            `;
        }
        else {
            subject = 'TravelCF - Account Activation';
            
            const activationLink = `${FRONT_APP_URL}${PAGES.activation.path}?key=${key}`;
            html = `
                <p>Thank you for your registration with TravelCF</p>
                <p>Please click following link to activate your account:</p>
                <p><a href="${activationLink}">${activationLink}</a></p>
                <p>Thanks you.</p>
            `;
        }



        Email.Send({
            to: email,
            subject,
            html,
        });
    }

    _SendResetPasswordEmail(onMobile, key, email) {
        let subject, html;
        
        if (onMobile) {
            subject = `${key} Is Your TravelCF Confirmation Code to Reset Password`;
            html = `
                <p>Hi,</p>
                <p>${key} is your Confirmation Code to reset password.</p>
                <p>Thank you.</p>
            `;
        }
        else {
            subject = 'TravelCF - Reset Password';

            const resetLink = `${FRONT_APP_URL}${PAGES.resetPassword.path}?key=${key}`;   
            html = `
                <p>Hi,</p>
                <p>Please click following link to reset your password:</p>
                <p><a href="${resetLink}">${resetLink}</a></p>
                <p>Thanks you.</p>
            `;
        }
        Email.Send({
            to: email,
            subject,
            html
        });       
    }

    _GenerateHash(text) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err){reject(err);}
                bcrypt.hash(text, salt, null, (err, hash) => {
                    if (err){reject(err);}
                    resolve(hash);
                });
            });
        });
    }

}

module.exports = new User();