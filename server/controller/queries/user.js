const {
    tables: { users: { table } } 
} = require('../../../db/queries');

exports.createUser = (email, password, tokenId, key, searches = '', activated = false)  => {
    return `
        INSERT INTO ${table} (
            email,
            password,
            token_id,
            searches,
            activated,
            key
        )
        VALUES (
            '${email}',
            '${password}',
            '${tokenId}',
            '${searches}',
            '${activated}',
            '${key}'
        );        
    `;
}

exports.activateUser = ({ email }) => {
    return `
        UPDATE ${table}
        SET activated = true, key = ''
        WHERE email = '${email}';       
    `;
}

exports.removeUnactivatedUserIfExists = ({ email }) => {
    return `
        DELETE FROM ${table}
        WHERE email='${email}' AND activated=false;        
    `;
}

exports.findExistingUser = ({ email }) => {
    return `
        SELECT * FROM ${table} 
        WHERE email='${email}' AND activated=true;        
    `;
}

exports.findByEmail = ({ email }) => {
    return `
        SELECT * FROM ${table}
        WHERE email='${email}'   
    `;
}

exports.findByTokenId = ({ id }) => {
    return `
        SELECT * FROM ${table}
        WHERE token_id = '${id}'
    `;
}

exports.findByKey = ({ key, email }) => {
    let query = `
        SELECT * FROM ${table} 
        WHERE key='${key}'
    `;

    if (email) {
        query += ` AND email='${email}'`;
    }

    return query;
}

exports.updateUser = ({ set, where }) => {
    return `
        UPDATE ${table}
        SET ${set}
        WHERE ${where}        
    `;
}


