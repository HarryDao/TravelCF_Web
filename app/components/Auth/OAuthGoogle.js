import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import * as actions from '../../actions';
import { Switch } from '../../styles/transitions';
import { PAGES } from '../../../configs/app';


class OAuthGoogle extends React.Component {
    state = { loading: true, error: true, count: 3 };

    componentWillMount() {
        const queries = queryString.parse(this.props.location.search);
        
        if (queries && queries.code) {
            this.props.loginWithOAuthGoogle(queries.code, (err) => {
                err ? this.onLoginFail() : this.onLoginSuccess();
            });
        }
        else {
            this.onLoginFail();
        }

    }

    onLoginSuccess = () => {
        this.setState({ error: false, loading: false });
                
        this.startCountDown(() => {
            this.props.history.push(PAGES.home.path);
        })
    }

    onLoginFail = () => {
        this.setState({ error: true, loading: false });
                
        this.startCountDown(() => {
            this.props.history.push(PAGES.login.path);
        })
    }

    startCountDown = (cb) => {
        const countDown = setInterval(() => {
            const currentCount = this.state.count;
            
            this.setState({ count: currentCount - 1 });
            if (currentCount === 1) {
                clearInterval(countDown);
                return cb();
            }
        }, 1000);
    }

    renderMessage() {
        const { count, error } = this.state;
        const time = `${count} second${count > 1 ? 's' : ''}`;

        if (error) {
            return (
                <div className='inner'>
                    <h1 className='error'>Sorry, there is something wrong.</h1>
                    <h2>You will be redirected to <span className='highlight'>Login page</span> in <span className='highlight'>{time}</span>...</h2>
                </div>
            );
        }

        return (
            <div className='inner'>
                <h1 className='success'>Your login is successful!</h1>
                <h2>You will be redirected to <span className='highlight'>Home page</span> in <span className='highlight'>{time}</span>...</h2>
            </div>
        );
    }

    render(){
        return Switch(
            { in: this.state.loading },
            style => {
                return (
                    <div
                        className='loading_spinner'
                        key='loading'
                        style={style}
                    >
                        <div className='spinner_small'></div>
                    </div>
                );
            },
            style => {
                return  (
                    <div
                        className='oauth error'
                        key='error'
                        style={style}
                    >
                        {this.renderMessage()}
                    </div>
                );
            },
            250
        );
    }
}

export default connect(null, actions)(OAuthGoogle);