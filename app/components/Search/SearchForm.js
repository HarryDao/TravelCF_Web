import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import InputAirport from './InputAirport';
import InputDate from './InputDate';
import LS from '../../services/LocalStorage';
import {
    DefaultCalendar, 
    updateCalendarOnNewProps, 
} from './helpers/time';
import { PAGES } from '../../../configs/app';

const INPUTS = ['origin', 'destination', 'departDate', 'returnDate'];
const CALENDAR_MARGIN_LEFT = {
    max: 0,
    min: -1200,
    step: 100,
}


class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeInput: '',
            formValid: false,
            origin: {
                search: '',
                value: '',
            },
            destination: {
                search: '',
                value: '',
            },
            departDate: {
                search: '',
                value: '',
            },
            returnDate: {
                search: '',
                value: '',
            },
            calendar: JSON.parse(JSON.stringify(DefaultCalendar)),
            calendarPosition: {
                marginLeft: CALENDAR_MARGIN_LEFT.max
            }
        }
    }

    
    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);

        const savedSearch = LS.GetSavedSearch();

        if (!savedSearch || !savedSearch.state || !savedSearch.props) {
            this.props.fetchOrigin();
            return;
        }

        const { state, props } = savedSearch;

        this.props.restoreSavedSearch(props);
        this.setState(state);
    }


    handleClick = (e) => {
        if (!this.node.contains(e.target)){
            this.onActiveInputChange('reset');   
        }
    }


    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }


    componentWillReceiveProps(nextProps) {
        const newCalendar = updateCalendarOnNewProps(nextProps, this.props);
        
        if (newCalendar) {
            this.setState({ calendar: newCalendar });
        }

        const formValid = this.onFormValidate(nextProps);
        this.setState({ formValid });
    }


    onOptionClick = (type, value, search) => {
        if (value === this.state[type].value) {
            this.setState({
                [type]: {
                    ...this.state[type],
                    search,
                    value
                }
            });
            return this.onActiveInputChange('reset');
        }

        const newState = JSON.parse(JSON.stringify(this.state));
        const typeIndex = INPUTS.indexOf(type);

        INPUTS.map((input, index) => {
            if (index > typeIndex) {
                newState[input] = { search: '', value: '' };
            }
            if (index === typeIndex) {
                newState[input] = { search, value };
            }
        });

        this.setState({ ...newState });

        const {
            origin,
            destination,
            hasReturnDate,

            setOrigin,
            fetchDestination,
            setDestination,
            fetchDepartDate,
            setDepartDate,
            fetchReturnDate,
            setReturnDate,
        } = this.props;

        switch(type) {
            case 'origin':
                setOrigin({ origin: value });
                fetchDestination({ origin: value });
                break;
            case 'destination':
                setDestination({ destination: value });
                fetchDepartDate({ origin, destination: value });
                break;
            case 'departDate':
                setDepartDate({ departDate: value });
                fetchReturnDate({ origin, destination, departDate: value });
                
                if (!hasReturnDate) {
                    return this.onActiveInputChange('reset');
                }

                break;
            case 'returnDate':
                setReturnDate({ returnDate: value });
                break;
        }

        this.onActiveInputChange('next');
    }
    

    onActiveInputChange = (type) => {
        let nextActiveInput;
        
        switch(type) {
            case 'reset':
                nextActiveInput = '';
                break;
            case 'next':
                const current = INPUTS.indexOf(this.state.activeInput);
                nextActiveInput = current === INPUTS.length - 1 ? '' : INPUTS[current + 1];
                break;
            default: 
                nextActiveInput = type;
        }

        this.setState({ activeInput: nextActiveInput });
    }

    
    onSearchChange = (type, value) => {
        this.setState({
            [type]: { ...this.state[type], search: value }
        });

        // if (type === 'departDate' || type === 'returnDate') {
        //     let [year, month, date] = value.split('-');
        //     year = parseInt(year);
        //     month = parseInt(month);
        //     date = parseInt(date);
            
        //     const time = Date.UTC(year, month - 1, date, 0, 0, 0);
            
        //     if (time < Today.time) {
        //         return;
        //     }

        //     this.onOptionClick(
        //         type, 
        //         { year, month, date }, 
        //         composeDateText(year, month,  date)
        //     );
            
        // }
    }


    onCalendarArrowClick = (arrow, multipler) => {
        let { max, min, step } = CALENDAR_MARGIN_LEFT;
        let { marginLeft } = this.state.calendarPosition;
        
        max = max/multipler;
        step = step/multipler;

        min = min/multipler + step * multipler;

        switch(arrow) {
            case 'right':
                marginLeft -= step;
                break;
            case 'left':
                marginLeft += step;
                break;
        }

        marginLeft = marginLeft < min ? min : marginLeft;
        marginLeft = marginLeft > max ? max : marginLeft;

        this.setState({ calendarPosition: { marginLeft } });
    }


    onReturnDateToggle = (nextState) => {

        this.props.toggleReturnDate(nextState);

        this.setState({
            returnDate: { search: '', value: '' }
        });

        if (nextState) {
            this.onActiveInputChange('returnDate');
        }

    }

    
    onFormValidate(props) {
        const {
            origin,
            destination,
            departDate,
            hasReturnDate,
            returnDate,
        } = props;

        let isValid = true;

        if (!origin || !destination || !departDate) {
            isValid = false;
        }

        if (hasReturnDate && !returnDate) {
            isValid = false;
        }

        return isValid;
    }


    onFormSubmit = (e) => {
        e.preventDefault();
        
        if (!this.state.formValid) {
            return;
        }

        const {
            origin,
            destination,
            departDate,
            hasReturnDate,
            returnDate,
            originOptions,
            destinationOptions,
            departDateOptions,
            returnDateOptions,
        } = this.props;

        const props = {
            origin,
            destination,
            departDate,
            hasReturnDate,
            returnDate,
            originOptions,
            destinationOptions,
            departDateOptions,
            returnDateOptions,           
        }

        const state = this.state;
        
        LS.SaveSearch(state, props);
        this.props.saveUserNewSearch({ origin, destination, departDate, returnDate, props, state });

        this.props.onPathChange(PAGES.search.path);
    }


    renderToggleReturnDateInput() {
        return (
            <div className='input-search toggle-return-date'>
                <label>
                    <input
                        type='radio'
                        checked={this.props.hasReturnDate ? false: true}
                        onChange={() => this.onReturnDateToggle(false)}
                    />One-way
                </label>

                <label>
                    <input
                        type='radio'
                        checked={this.props.hasReturnDate ? true: false}
                        onChange={() => this.onReturnDateToggle(true)}
                    />Return
                </label>
            </div>
        );
    }    


    render() {
        const {
            originOptions,
            destinationOptions,
            hasReturnDate,

            style,
            inline
        } = this.props;

        return (
            <div 
                className={`search-form ${inline ? 'inline' : ''}`}
                ref={node => this.node = node}
                style={style || {}}
            >
                <div className='inner'>
                    <form onSubmit={this.onFormSubmit}>

                        {inline ? this.renderToggleReturnDateInput() : ''}

                        <InputAirport
                            type='origin'
                            label='From'
                            placeholder='Select a city'
                            search={this.state.origin.search}
                            onSearchChange={this.onSearchChange}
                            options={originOptions}
                            onOptionClick={this.onOptionClick}     
                            activeInput={this.state.activeInput}
                            onActiveInputChange={this.onActiveInputChange}               
                        />
                        <InputAirport
                            type='destination'
                            label='To'
                            placeholder='Select a city'
                            search={this.state.destination.search}
                            onSearchChange={this.onSearchChange}
                            options={destinationOptions}
                            onOptionClick={this.onOptionClick}     
                            activeInput={this.state.activeInput}
                            onActiveInputChange={this.onActiveInputChange}                     
                        />
                        
                        {inline ? '' : this.renderToggleReturnDateInput()}

                        <InputDate
                            className={`left`}
                            type='departDate'
                            label='Depart'
                            placeholder='Select a date'
                            search={this.state.departDate.search}
                            onSearchChange={this.onSearchChange}
                            onOptionClick={this.onOptionClick}     
                            activeInput={this.state.activeInput}
                            onActiveInputChange={this.onActiveInputChange}  
                            calendar={this.state.calendar}
                            calendarPosition={this.state.calendarPosition}
                            onCalendarArrowClick={this.onCalendarArrowClick}
                        />

                        <InputDate
                            className={`right ${hasReturnDate ? '' : 'hidden'}`}
                            type='returnDate'
                            label='Return'
                            placeholder='Select a date'
                            search={this.state.returnDate.search}
                            onSearchChange={this.onSearchChange}
                            onOptionClick={this.onOptionClick}     
                            activeInput={this.state.activeInput}
                            onActiveInputChange={this.onActiveInputChange}  
                            calendar={this.state.calendar}
                            calendarPosition={this.state.calendarPosition}
                            onCalendarArrowClick={this.onCalendarArrowClick}
                        />

                        <button 
                            type='submit' 
                            className={this.state.formValid ? '' : 'disabled'}
                            disabled={!this.state.formValid}
                        >
                            Search
                        </button>
                    </form>
                </div>
 
            </div>
        );
    }
}


const mapStateToProps = ({ search }) => {
    const {
        originOptions,
        destinationOptions,
        departDateOptions,
        returnDateOptions,
        origin,
        destination,
        departDate,
        hasReturnDate,
        returnDate 
    } = search.searchForm;

    return {
        originOptions,
        destinationOptions,
        departDateOptions,
        returnDateOptions,
        origin,
        destination,
        departDate,
        hasReturnDate,
        returnDate        
    }
}


export default connect(mapStateToProps, actions)(SearchForm);