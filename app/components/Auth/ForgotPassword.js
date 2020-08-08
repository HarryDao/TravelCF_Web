import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../../actions';
import { createInput, displayMessage } from './common';
import { validateEmail } from './helpers/validation';

const FORM_NAME = 'forgot-password';


class ForgotPassword extends Component {
    state = {
        message: '',
    }

    onFormSubmit = ({ email }) => {
        
        this.setState({ message: '' });

        this.props.requestResetPassword({ email }, () => {
            this.setState({
                message: 'An email to reset password has been sent to your email account.'
            });
        });
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <div className='request-reset-password'>

                <h1>Forgot Password</h1>

                <form onSubmit={handleSubmit(this.onFormSubmit)}>
                    
                    {displayMessage(this.state.message, 'message success')}

                    <Field
                        name='email'
                        component={createInput}
                        label='Enter your email'
                        type='text'
                        placeholder='user@gmail.com'
                    />

                    <button type='submit'>
                        Submit
                    </button>
                </form>
            </div>

        );
    }
}

const validate = ({ email }) => {
    const errors = {};

    const emailError = validateEmail(email);
    if (emailError){
        errors.email = emailError;
    }

    return errors;
}

export default reduxForm({
    form: FORM_NAME,
    validate
})(connect(null, actions)(ForgotPassword));