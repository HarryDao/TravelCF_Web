const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const jwtDecode = require('jwt-decode');
const {
    OAUTH_GOOGLE: {
        CLIENT_ID,
        IOS_ID,
        ANDROID_ID,
        CLIENT_SECRET, 
        REDIRECT_URL, 
        SCOPES
    }
} = require('../../configs/server');

const client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);
const clientIOS = new OAuth2Client(IOS_ID);
const clientAndroid = new OAuth2Client(ANDROID_ID);

exports.getURL = () => {
    return client.generateAuthUrl({ scope: SCOPES });
}

exports.login = async(code) => {
    try {
        const { tokens: { id_token } } = await client.getToken(code);
        const { email } = jwtDecode(id_token);
        return email;
    }
    catch(err) {
        throw err;
    }
}

exports.getMobileConfigs = () => {
    return {
        ios: IOS_ID,
        android: ANDROID_ID,
    }
}

exports.verifyIdToken = async (idToken) => {
    let email = null;
    
    try {
        email = await verifyIDByOS('IOS', idToken);
    }
    catch(err) {console.log('Invalid IOS token!')}

    if (!email) {
        try {
            email = await verifyIDByOS('Android', idToken);
        }
        catch(err) {console.log('Invalid Android token!')}
    }

    if (!email) {
        throw 'Invalid Token';   
    }

    return email;
}

const verifyIDByOS = async (os, idToken) => {
    try {
        const client = os === 'IOS' ? clientIOS : clientAndroid;
        const ID = os === 'IOS' ? IOS_ID : ANDROID_ID;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: ID,
        });
        const { email_verified, email } = ticket.getPayload();
        
        if (email_verified && email) {
            return email;
        }

        throw 'Invalid Token';

    }
    catch(err) {
        throw err;
    }
}
