import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions';
import { images, videos } from '../media';
import { PAGES } from '../../configs/app';
import { Switch, Fade } from '../styles/transitions';


class Header extends Component {
    state = { showMenuMobile: false, authenticated: false }


    componentWillMount() {
        this.changeActiveNavbar(this.props.location.pathname);
    }


    componentWillUpdate(nextProps) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            this.changeActiveNavbar(nextProps.location.pathname);
        }
    }


    changeActiveNavbar(path) {
        for (let page in PAGES) {
            if (PAGES[page].path === path) {
                this.props.pageNavChange(page);
                break;
            }
        }       
    }


    toggleActiveMenu(key) {
        return this.props.nav === key ? 'active' : '';
    }


    onLogoutClick = () => {
        this.props.logoutUser();
        this.setState({ showMenuMobile: false });
    }

    onMenuMobileToggle = () => {
        this.setState({ showMenuMobile: !this.state.showMenuMobile })
    }

    renderLoginButton() {
        const { login } = PAGES;
        const { authenticated, email } = this.props;

        return Switch({ in: authenticated ? true: false }, 
            (style) => {
                return (
                    <li
                        key='user-header-logout'
                        className="dropdown" 
                        style={style}
                    >
                        <a>
                            {email}
                            <i className='fa fa-caret-down'></i>
                        </a>

                        <ul>
                            <li>
                                <a onClick={this.onLogoutClick}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </li>  
                );
            },
            (style) => {
                return (
                    <li
                        key='user-header-login'
                        className={this.toggleActiveMenu('login')} 
                        style={style}                   
                    >
                        <Link to={login.path} >
                            {login.navName}
                        </Link>
                    </li>                  
                );
            },
            100
        );
    }


    renderLoginMobileButton() {
        const { login } = PAGES;
        const { authenticated } = this.props;  

        if (authenticated) {
            return (
                <li>
                    <a onClick={this.onLogoutClick}>
                        Logout
                    </a>
                </li>
            );
        }

        return (
            <li onClick={this.onMenuMobileToggle}>
                <Link to={login.path}>
                    {login.navName}
                </Link>
            </li>
        );
    }


    renderMenuMobile() {
        const { home } = PAGES;
        const { showMenuMobile } = this.state;


        return Fade({ in: showMenuMobile }, style => {
            const className = `menu-mobile ${showMenuMobile ? 'active' : ''}`;

            return (
                <div className={className} style={style}>
                    <ul>
                        <li onClick={this.onMenuMobileToggle}>
                            <Link to={home.path} >
                                {home.navName}
                            </Link>
                        </li>

                        {this.renderLoginMobileButton()}
                    </ul>
                </div>
            );
        });

    }


    render() {
        const { home } = PAGES;

        return (
            <header>
                <div className="navbar">
                    <div className='inner'>
                        <div className="icon">
                            <Link to={home.path}>
                                <img src={images.travelcf} />
                            </Link>
                        </div>

                        <ul className='menu'>
                            <li className={this.toggleActiveMenu('home')} >
                                <Link to={home.path}>
                                    {home.navName}
                                </Link>
                            </li>

                            {this.renderLoginButton()}
                        </ul>

                        <div className='menu-mobile-icon' onClick={this.onMenuMobileToggle}>
                            <a ref='menuMobile'>
                                <i className='fa fa-bars'></i>
                            </a>
                        </div>

                        {this.renderMenuMobile()}
                    </div>
                </div>                

                <div className="title"  >
                    <div className='video-container'>
                        <video autoPlay loop ref={'timeLapseVideo'}>
                            <source src={videos.timeLapse} />
                            YOUR BROWSER DOES NOT SUPPORT VIDEO PLAYING
                        </video>
                    </div>
                    <h1>TRAVEL CF</h1>
                    <h4>Compare air tickets</h4>
                </div>
            </header>
        );
    }
}


const mapStateToProps = ({ nav, auth }) => {
    const { authenticated, email } = auth.login;
    return { nav, authenticated, email };
}


export default connect(mapStateToProps, actions)(Header);