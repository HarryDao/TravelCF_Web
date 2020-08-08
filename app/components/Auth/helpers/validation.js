export const validateEmail = (email) => {
    if (!email) {
        return 'please enter email address!';
    }
    else if (!/[\@]/.test(email) || !/\./.test(email)) {
        return 'email invalid!';
    }

    return null;
}


export const validatePassword = (password) => {
    if (!password) {
        return 'please enter password!';
    }
    else if (password.length < 6) {
        return 'use 6 characters or more!';
    }
    else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        return 'please enter at least 1 Lowercase, 1 Uppercase and 1 Digit!';
    }

    return null;
}


export const comparePasswords = (password, password2) => {
    return password === password2 ? null : `those passwords didn\'t match!`;
}

