import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Search from './components/Search/Search';
import requireAuthentication from './components/requireAuthentication';
import Login from './components/Auth/Login';
import Activation from './components/Auth/Activation';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import OAuthGoogle from './components/Auth/OAuthGoogle';
import { PAGES } from '../configs/app';


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Switch>
                        <Route path={PAGES.activation.path} component={Activation} />

                        <BrowserRouter>
                            <div>
                                <Route path='/' component={Header}/>

                                <div className='container'>
                                    <Switch>
                                        <Route path={PAGES.oAuthGoogle.path} component={OAuthGoogle} />
                                        <Route path={PAGES.forgotPassword.path} component={ForgotPassword} />
                                        <Route path={PAGES.resetPassword.path} component={ResetPassword}/>
                                        <Route path={PAGES.login.path} component={Login}/>
                                        
                                        <Route path={PAGES.search.path} component={requireAuthentication(Search)} />
                                        <Route path='/' component={requireAuthentication(Home)}/>
                                    </Switch>
                                </div>

                                <Route path='/' component={Footer} />
                            </div>
                        </BrowserRouter>
                    </Switch>
                </div>

            </BrowserRouter>
        );
    }
}


export default App;