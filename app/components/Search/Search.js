import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchForm from './SearchForm';
import SearchResult from './SearchResult';
import { Fade } from '../../styles/transitions';
import { TOGGLE_SHOW_TIMEOUT } from '../../../configs/app';


class Search extends Component {
    state = { showForm: false }

    componentWillMount() {
        setTimeout(() => {
            this.setState({ showForm: true });
        }, TOGGLE_SHOW_TIMEOUT)
    }

    renderSearchForm() {
        return Fade({ in: this.state.showForm }, style => {
            return <SearchForm inline style={style} />;
        });
    }

    render() {
        return (
            <div className='search'>
                {this.renderSearchForm()}
                
                <SearchResult />
            </div>
        );
    }
}



export default connect()(Search);

