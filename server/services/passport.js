const passport = require('passport');
const LocalStrategy = require('passport-local');
const {
    Strategy: JwtStrategy,
    ExtractJwt,
} = require('passport-jwt');

const User = require('../controller/user');

const { tables: { users: { table: TABLE_USER } } } = require('../../db/queries');
const { JWT: { SECRET } } = require('../../configs/server');


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    const tokenId = payload.sub.replace(payload.iat, '');
    const query = `
        SELECT * FROM ${TABLE_USER}
        WHERE token_id='${tokenId}'
    `;

    User.QuickQueryWithCB(query, [], ({ err, rows }) => {
        return done(err, rows && rows[0] ? rows[0] : false);
    });
});

const localOptions = {
    usernameField: 'email'
}

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    if (!User.ValidateEmailAndPassword(email, password)) {
        return done(null, false);
    }

    email = email.toLowerCase();
    const query = `
        SELECT * FROM ${TABLE_USER}
        WHERE email = '${email}' AND activated = true
    `;

    User.QuickQueryWithCB(query, [], ({ err, rows }) => {
        if (err){ return done(err); }

        if (!rows || !rows[0]){ return done(null, false); }

        const user = rows[0];

        User.ComparePassword(password, user.password, (err, isMatch) => {
            if (err) { return done(err); }
            
            return done(null, isMatch ? user : false);
        });
    });
});

passport.use(jwtLogin);
passport.use(localLogin);