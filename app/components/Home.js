import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SearchForm from './Search/SearchForm';
import SearchHistory from './Search/SearchHistory';
import { Switch } from '../styles/transitions';


class Home extends Component {

    state = { show: true }

    componentWillMount() {
        window.scrollTo(0, 0);
        
        this.setState({ show: false });

        setTimeout(() => {
            this.setState({ show: true });
        }, 500);
    }


    onPathChange = (path) => {
        this.setState({ show: false });

        setTimeout(() => {
            this.props.history.push(path);
        }, 500);
    }


    render() {
        return Switch(
            {in: this.state.show},
            style => {
                return (
                    <div key='home' className='home' style={style}>
                        <div className='inner'>
                            <SearchForm onPathChange={this.onPathChange}/>
                            <SearchHistory onPathChange={this.onPathChange}/>
                        </div>
                    </div>
                );
            },
            style => {
                return (
                    <div key='home-loading' className='home' style={style}>
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


export default connect(null, actions)(Home);
