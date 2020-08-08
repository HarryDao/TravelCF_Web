import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PAGES } from '../../configs/app';


export default (TargetComponent) => {
    
    class Authentication extends Component {
        componentWillMount() {
            const { authenticated, history } = this.props;
            
            if (!authenticated) {
                history.push(PAGES.login.path);
            }
        }


        componentWillUpdate(nextProps) {
            const { authenticated, history } = nextProps;
            
            if (!authenticated) {
                history.push(PAGES.login.path);
            }
        }


        render() {

            if (this.props.authenticated) {
                return (
                    <TargetComponent {...this.props} />
                );
            }
            else {
                return (
                    <div>Unauthenticated</div>
                );
            }
        }
    }


    const mapStateToProps = ({ auth }) => {
        const { authenticated } = auth.login;
        return { authenticated };
    }


    return connect(mapStateToProps)(Authentication);
}
