import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import * as actions from '../../actions';
import { PAGES } from '../../../configs/app';


class Activation extends Component {
    state = {
        countDown: 3
    }

    componentWillMount() {
        const queries = queryString.parse(this.props.location.search);
        
        if (queries.key){
            this.props.activateUser({ key: queries.key });
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.countDown <= 0) {
            this.props.history.push(PAGES.login.path);
        }
    }

    startCountDown() {
        let { countDown } = this.state;
        setTimeout(() => {
            countDown --;
            if (countDown >= 0){
                this.setState({ countDown }); 
            }
        }, 1000);
    }

    renderMessage() {
        const { activated } = this.props;

        switch(activated) {
            case true:
                const { countDown } = this.state;
                this.startCountDown();

                return (
                    <div className="result success">
                        <h1>Your account is successfully activated!</h1>
                        <p>You will be redirected to <span className='highlight'>Login page</span> in <span className='highlight'>{countDown} second{countDown > 1 ? 's' : ''}</span>...</p>
                    </div>
                );
            case false:
                return (
                    <div className="result fail">
                        <h1>Oop! Something went wrong!</h1>
                        <p>You may enter an invalid link or your account is already activated.</p>
                    </div>
                );
            default:
                return (
                    <div className="loading_spinner">
                        <div className="spinner_small"></div>
                    </div>
                );
        }
    }

    render() {
        return (
            <div className="activation">
                {this.renderMessage()}
            </div>
        );
    }
}

const mapPropToState = ({ auth }) => {
    return { activated: auth.login.activated };
}

export default connect(mapPropToState, actions)(Activation);