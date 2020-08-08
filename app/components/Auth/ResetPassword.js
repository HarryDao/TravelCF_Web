import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import QueryString from 'query-string';
import * as actions from '../../actions';
import { createInput, displayMessage } from './common';
import { validatePassword, comparePasswords } from './helpers/validation';
import { PAGES } from '../../../configs/app';

const FORM_NAME = 'reset-password';


class ResetPassword extends Component {
    state = { key: null }

    componentWillMount() {
        const queries = QueryString.parse(this.props.location.search);

        if (queries.key){
            this.setState({ key: queries.key});
            this.props.validateResetPasswordLink({ key: queries.key })
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.reset) {
            setTimeout(() => {
                this.props.history.push(PAGES.login.path);
            }, 2000);
        }
    }

    onFormSubmit = ({ password }) => {
        const { email } = this.props;
        const { key } = this.state;

        this.props.resetPassword({ email, key, password });

    }

    renderForm() {
        const {
            handleSubmit,
            error,
            reset,
        } = this.props;

        const successMessages = reset ? [
            'Successfully reset password!',
            'Redirecting to Login page...'
        ] : [];

        return (
            <form onSubmit={handleSubmit(this.onFormSubmit)}>
            
                {displayMessage(error, 'message error')}
                {displayMessage(successMessages[0], 'message success')}
                {displayMessage(successMessages[1], 'message additional')}

                <Field
                    name='password'
                    component={createInput}
                    type='password'
                    label='New Password'
                    placeholder='password'
                />

                <Field
                    name='password2'
                    component={createInput}
                    type='password'
                    label='Confirm New Password'
                    placeholder='re-enter password'
                />

                <button type="submit">
                    Submit
                </button>
            </form>
        );
    }

    renderContent() {
        const { validKey } = this.props;

        switch(validKey){
            case true: 
                return this.renderForm();
            case false:
                return (
                    <div className="invalid">
                        <h1>Sorry, something went wrong!</h1>
                        <h4>The link can be invalid or has been used before.</h4>
                    </div>
                );
            default:
                return (
                    <div className="loading_spinner">
                        <div className="spinner"></div>
                    </div>
                );
        }
    }

    render() {
        return (
            <div className="reset-password">
                <h1>Reset Password</h1>
                {this.renderContent()}
            </div>
        );
    }
}

const validate = ({ password, password2 }) => {
    const errors = {};

    const passwordError = validatePassword(password);
    if (passwordError){
        errors.password = passwordError;
    }

    const password2Error = comparePasswords(password, password2);
    if (password2Error){
        errors.password2 = password2Error;
    }

    return errors;
}

const mapPropToState = ({ auth }) => {
    const { validKey, email, error, reset } = auth.resetPassword;
    return { validKey, email, error, reset }
}

export default reduxForm({
    form: FORM_NAME,
    validate,
})(connect(mapPropToState, actions)(ResetPassword));

