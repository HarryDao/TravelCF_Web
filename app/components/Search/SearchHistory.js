import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import LS from '../../services/LocalStorage';
import { getDateInfo, composeDateText } from './helpers/time';
import { images } from '../../media';
import { Switch } from '../../styles/transitions';
import { MIN_FETCH_DURATION } from '../../../configs/app';
import { PAGES } from '../../../configs/app';


class SearchHistory extends Component {

    state = { show: false }

    componentWillMount() {
        const startFetching = new Date();
        
        this.props.fetchUserSearchHistory(() => {
            const fetchDuration = new Date() - startFetching;
            const timeOut = fetchDuration > MIN_FETCH_DURATION ? 0: MIN_FETCH_DURATION - fetchDuration;

            setTimeout(() => {
                this.setState({ show: true });
            }, timeOut);
        });
    }


    onSearchClick = (search) => {
        const { origin, destination, departDate, props, state } = search;

        if (!origin || !destination || !departDate) {
            return;
        }

        LS.SaveSearch(state, props);

        this.props.onPathChange(PAGES.search.path);        
    }


    renderTrip(origin, destination, tripDate) {
        if (!origin || !destination || !tripDate) {
            return '';
        }

        const { cities } = this.props;
        const {
            year, 
            month,
            monthString,
            date,
            dayString,
        } = getDateInfo(
            new Date(
                Date.UTC(tripDate.year, tripDate.month - 1, tripDate.date, 0, 0, 0)
            )
        );

        origin = cities[origin];
        destination = cities[destination];

        return (
            <div className='trip'>
                <div className='date'>
                    <h4>{composeDateText(year, month, date)}</h4>
                    <h5>({dayString.slice(0,3)}, {monthString.slice(0.3)} {date}, {year})</h5>
                </div>
                
                <div className='origin'>
                    <h4>{origin.city}</h4>
                    <h5>({origin.country})</h5>
                </div>

                <div className='icon'>
                    <img src={images.airlineToRight}/>
                </div>

                <div className='destination'>
                    <h4>{destination.city}</h4>
                    <h5>({destination.country})</h5>
                </div>
            </div>
        );
    }


    renderSearch(search, index) {
        const { origin, destination, departDate, time, returnDate } = search;

        const { monthString, date, year, dayString } = getDateInfo(new Date(time));
        const searchDateText = `${date}, ${monthString.slice(0, 3)} ${year} (${dayString.slice(0, 3)}):`;

        return (
            <div
                key={`search-${index}`} 
                className='search'
                onClick={() => this.onSearchClick(search)}
            >
                <div className='time'>
                    {searchDateText}
                </div>

                {this.renderTrip(origin, destination, departDate)}
                {this.renderTrip(destination, origin, returnDate)}
            </div>
        );
    }


    render() {
        let { searches } = this.props;

        if (searches && searches.length > 0) {
            searches = this.props.searches.map((search, index) => {
                return this.renderSearch(search, index);
            });
        }
        else {
            searches = (() => <h4 className='no-data'>
                You don't have any recent search yet...
            </h4>)();
        }


        const renderContent = () => {
            return Switch(
                { in: this.state.show },
                style => {
                    return (
                        <div key='searches' className='searches' style={style}>
                            {searches}
                        </div>
                    );
                },
                style => {
                    return (
                        <div key='searches-loading' className='loading_spinner' style={style}>
                            <div className='spinner_small'></div>
                        </div>
                    );
                },
                200               
            )
        }

        return (
            <div className='search-history'>
                <h1 className='title'>Your recent searches:</h1>
                {renderContent()}
            </div>
        );
    }
}


const mapStateToProps = ({ search }) => {
    const { searches, cities } = search.searchHistory;

    return { searches, cities };
}


export default connect(mapStateToProps, actions)(SearchHistory);