import React, { Component } from 'react';
import _ from 'lodash';
import { Fade } from '../../styles/transitions/index';

const isSearchedAirport = (search, description) => {
    description = description.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    search = search.toLowerCase().replace(/[^a-z0-9\s]/g, '');

    return description.indexOf(search) > -1;
}


class InputAirport extends Component {

    componentWillReceiveProps(nextProps) {
        const { type, activeInput } = nextProps;

        if (type === activeInput) {
            this.refs.input.focus();
        }
    }


    onInputFocus = (e) => {
        const { type, onActiveInputChange } = this.props;

        e.target.select();
        onActiveInputChange(type);
    }

    renderAirports() {
        let {
            type,
            search, 
            options, 
            onOptionClick, 
            activeInput,
        } = this.props;

        options = _.map(options, option => {
            const { iata, city, country } = option;

            const airportKey = `${type}-${iata}`;
            const text = `${city} - ${country} (${iata})`;
            const isValid = isSearchedAirport(search, text);

            if (isValid) {
                return (
                    <li
                        key={airportKey}
                        onClick={() => onOptionClick(type, iata, text)}
                    >{text}</li>                    
                );
            }      
        });

        return Fade({ in: type === activeInput }, style => {
            return (
                <ul style={style}>
                    {options}
                </ul>
            );
        });        
    }


    render() {
        const {
            type,
            label,
            placeholder,
            search,
            onSearchChange,
        } = this.props;

        return (
            <div className="input-search input-airport">
                <label>{label}:</label>
                <input
                    ref='input'
                    type='text'
                    placeholder={placeholder}
                    value={search}
                    onChange={e => onSearchChange(type, e.target.value)}
                    onFocus={this.onInputFocus}
                />

                {this.renderAirports()}
            </div>
        );
    }
}


export default InputAirport;