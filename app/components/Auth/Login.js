import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import * as actions from '../../actions';
import { PAGES } from '../../../configs/app';
import { createInput, displayMessage } from './common';
import { validateEmail, validatePassword, comparePasswords } from './helpers/validation';
import { Switch, Fade } from '../../styles/transitions';
import { TOGGLE_SHOW_TIMEOUT } from '../../../configs/app';

const FORM_NAME='authForm';


class Login extends Component {
    
    state = { show: false, success: false, processing: false }

    componentWillMount() {
        if (this.props.authenticated) {
            return this.props.history.push(PAGES.home.path); 
        }

        this.props.resetForm();
        this.props.reset();

        setTimeout(() => {
            this.setState({ show: true });
        }, TOGGLE_SHOW_TIMEOUT);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.authenticated) {
            this.props.history.push(PAGES.home.path);  
        }

        if (
            nextProps.isRegister !== this.props.isRegister &&
            !this.state.success
        ) {
            this.props.resetForm();
        }
    }

    onOAuthGoogleClick = (e) => {
        e.preventDefault();

        this.props.generateOAuthGoogleURL((err, url) => {
            if (url) {
                window.open(url, '_self');
            }
        });
    }

    onOAuthFacebookClick = (e) => {
        e.preventDefault();

    }

    onSubmit = ({ email, password, isRegister }) => {
        const {
            loginUser,
            registerUser,
            reset,
            history
        } = this.props;

        this.setState({ processing: true });

        if (isRegister) {
            registerUser({ email, password }, () => {
                this.setState({ success: true, processing: false });
                reset();
            }, () => {
                this.setState({ processing: false });
            });
        }
        else {
            loginUser({ email, password }, () => {
                this.setState({ success: true, processing: false });
                reset();
                history.push(PAGES.home.path)
            }, () => {
                this.setState({ processing: false });
            });
        }

    }

    renderConfirmPassword() {
        const { isRegister } = this.props;

        return Fade({ in: isRegister ? true: false }, style => {
            return (
                <Field
                    name='password2'
                    component={createInput}
                    type='password'
                    label='Confirm Password'
                    placeholder="re-enter password"
                    style={style}
                />
            );
        }, 200);
    }

    renderProcessingIcon() {
        return Fade({ in: this.state.processing }, style => {
            return (
                <div className='loading_spinner' style={style}>
                    <div className='spinner_small'></div>
                </div>
            );
        }, 50);
    }

    render() {
        const {
            error,
            message,
            handleSubmit,
            isRegister,
        } = this.props;

        const errorInfo = error && !isRegister ? 'You may enter wrong email or password. Or your account has not been activated!': ''

        return Switch(
            { in: this.state.show },
            style => {
                return (
                    <div key='login' className="login" style={style}>
                        <h1>
                            Login / Register
                        </h1>

                        {this.renderProcessingIcon()}

                        <form onSubmit={handleSubmit(this.onSubmit)}>

                            {displayMessage(message, 'message success')}
                            {displayMessage(error, 'message error')}
                            {displayMessage(errorInfo, 'message error additional')}
        
                            <Field
                                name="isRegister"
                                component={createInput}
                                label="Create New Account ?"
                                type="checkbox"
                                additionalClass="is-register"
                            />
        
                            <Field
                                name="email"
                                component={createInput}
                                type="text"
                                label="Email"
                                placeholder="user@gmail.com"
                            />
        
                            <Field
                                name="password"
                                component={createInput}
                                type="password"
                                label="Password"
                                placeholder="password"
                            />
        
                            {this.renderConfirmPassword()}
        
                            <div className="forgot-password">
                                <a target="_blank" href={PAGES.forgotPassword.path}>
                                    Forgot Password
                                </a>
                            </div>
        
        
                            <button type="submit">
                                Submit
                            </button>

                            <div className='oauth'>
                                <div className='google'>
                                    <button onClick={this.onOAuthGoogleClick}>
                                        <h1>
                                            <i className='fa fa-google' />
                                            Login with Google
                                        </h1>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                );
            },
            style => {
                return (
                    <div key='login-loading' className="login" style={style}>
                        <div className='loading_spinner'>
                            <div className='spinner_small'></div>
                        </div>
                    </div>
                );
            },
            300
            
        );

    }
}

const validate = ({ email, password, isRegister, password2 }) => {
    const errors = {};
    
    const emailError = validateEmail(email);
    if (emailError){
        errors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError){
        errors.password = passwordError;
    }

    if (isRegister){
        const password2Error = comparePasswords(password, password2);
        if (password2Error) {
            errors.password2 = password2Error;
        }
    }

    return errors;
}


const mapStateToProps = (state) => {
    const formSelector = formValueSelector(FORM_NAME);
    const { error, message, authenticated } = state.auth.login;

    return {
        isRegister: formSelector(state, 'isRegister'),
        error,
        message,
        authenticated,
    }
}

export default reduxForm({
    form: FORM_NAME,
    validate,
})(connect(mapStateToProps, actions)(Login));