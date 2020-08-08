import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { images } from '../../media';
import { convertMinutesToHours, getDateInfo } from './helpers/time';
import { Fade, Switch } from '../../styles/transitions';
import { MIN_FETCH_DURATION } from '../../../configs/app';

const ORDERS = [
    { text: 'Earliest Flight First', field: 'takeoff' },
    { text: 'Lowest Price First', field: 'price' }
];


class SearchResult extends Component {
    state = {
        depart: {
            loading: false,
            order: ORDERS[0].text
        },
        return: {
            loading: false,
            order: ORDERS[0].text,
            hidden: false,
        }
    }


    componentWillMount() {
        window.scrollTo(0, 0);

        this.fetchData(this.props, true, true);
    }


    componentWillReceiveProps(nextProps) {
        const reFetchDepart =             
            nextProps.origin !== this.props.origin ||
            nextProps.destination !== this.props.destination ||
            JSON.stringify(nextProps.departDate) !== JSON.stringify(this.props.departDate);
        
        const reFetchReturn = 
            nextProps.origin !== this.props.origin ||
            nextProps.destination !== this.props.destination ||            
            nextProps.hasReturnDate !== this.props.hasReturnDate ||
            JSON.stringify(nextProps.returnDate) !== JSON.stringify(this.props.returnDate);
        
        if (!reFetchDepart && !reFetchReturn) {
            return;
        }

        this.fetchData(nextProps, reFetchDepart, reFetchReturn);
    }


    fetchData(props, fetchDepart, fetchReturn) {
        const {
            origin,
            destination,
            departDate,
            hasReturnDate,
            returnDate,

            fetchDepartTrip,
            fetchReturnTrip,
        } = props;

        if (fetchDepart && origin && destination && departDate) {
            this.setState({
                depart: {
                    ...this.state.depart,
                    loading: true
                }
            });

            const startFetchDepartTrip = new Date();
            fetchDepartTrip({ origin, destination, departDate }, () => {
                this.showFetchedData(startFetchDepartTrip, () => {
                    this.setState({
                        depart: {
                            ...this.state.depart,
                            loading: false
                        }
                    });       
                });
            });
        }

        if (fetchReturn && origin && destination && hasReturnDate && returnDate) {
            this.setState({
                return: {
                    ...this.state.return,
                    loading: true,
                    hidden: false,
                }
            });

            const startFetchReturnTrip = new Date();
            fetchReturnTrip({ origin, destination, returnDate }, () => {
                this.showFetchedData(startFetchReturnTrip, () => {
                    this.setState({
                        return: {
                            ...this.state.return,
                            loading: false
                        }
                    });            
                });
            });
        }
        else {
            this.setState({ return: { ...this.state.return, hidden: true } });
        }   
    }


    showFetchedData(start, cb) {
        const duration = new Date() - start;
        const timeOut = duration > MIN_FETCH_DURATION ? 0 : MIN_FETCH_DURATION - duration;

        setTimeout(() => {
            cb();
        }, timeOut);
    }


    renderTrip(key, trip) {
        let {
            airline,
            origin,
            origin_city,
            destination,
            destination_city,
            takeoff,
            takeoff_local,
            landing,
            landing_local,
            minutes,
            price,
        } = trip;

        const { timeString } = convertMinutesToHours(minutes);
        const takeoffDateInfo = getDateInfo(new Date(parseInt(takeoff)));
        const landingDateInfo = getDateInfo(new Date(parseInt(landing)));

        return (
            <table
                key={key}
                className='trip'
            >
                <thead>
                    <tr>
                        <td colSpan={2}>
                            <h1>
                                USD {price}
                            </h1>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='info'>
                            <table>
                                <tbody>
                                    <tr className='duration'>
                                        <td colSpan={4}>
                                            {timeString}
                                        </td>
                                    </tr>

                                    <tr className='flight-info'>
                                        <td className='origin'>
                                            <h1 className='summary'>
                                                {origin}, {takeoff_local}
                                            </h1>
                                            <h3 className='city'>
                                                {origin_city}
                                            </h3>
                                            <p className='time'>
                                                {takeoffDateInfo.date} {takeoffDateInfo.monthString.slice(0.3)} ({takeoffDateInfo.dayString.slice(0,3)})
                                            </p>
                                        </td>
                                        
                                        <td className='airplane-direction'>
                                            <img src={images.airlineToRight} />
                                            
                                        </td>

                                        <td className='destination'>
                                            <h1 className='summary'>
                                                {destination}, {landing_local}
                                            </h1>
                                            <h3 className='city'>
                                                {destination_city}
                                            </h3>
                                            <p className='time'>
                                                {landingDateInfo.date} {landingDateInfo.monthString.slice(0.3)} ({landingDateInfo.dayString.slice(0,3)})
                                            </p>
                                        </td>

                                        <td className='airline'>
                                            <img src={images[airline]}/>
                                        </td>
                                    </tr>
                                    
                                </tbody>
                            </table>
                        </td>

                        <td className='price'>
                            <h1>
                                USD {price}
                            </h1>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }


    renderTrips(keyword, trips) {

        switch(this.state[keyword].order) {
            case ORDERS[0].text:
                trips = trips.sort((a, b) => a[ORDERS[0].field] > b[ORDERS[0].field] ? 1 : -1);
                break;
            case ORDERS[1].text:
                trips = trips.sort((a, b) => a[ORDERS[1].field] > b[ORDERS[1].field] ? 1 : -1);
                break;
        }

        trips = trips.map((trip, index) => {
            const key = `result-${key}-${index}`
            return this.renderTrip(key, trip);
        });

        return (
            <div className='trips'>
                {trips}
            </div>
        );
    }


    renderFilter(keyword) {
        const options = ORDERS.map(({text}, index) => {
            return (
                <option
                    key={`result-filter-${keyword}/${index}`}
                    value={text}
                >
                    {text}
                </option>
            );
        });

        return (
            <div className='filter'>
                <select
                    className='filter'
                    value={this.state[keyword].order}
                    onChange={e => this.setState({
                        [keyword]: {
                            ...this.state[keyword], 
                            order: e.target.value
                        }
                    })}
                >
                    {options}
                </select>

                <i className={`fa fa-caret-down`}></i>
            </div>

        );
    }


    renderWay(index, keyword, trips) {
        const hasData = trips && trips.length > 0;
        let title = `${index}. No ${keyword} trip is found. We are sorry for the inconvenience...`;

        if (hasData) {
            const { origin_city, destination_city } = trips[0];
            title = `${index}. ${origin_city} to ${destination_city}:`;
        }


        let toggleContent = () => {
            return Switch(
                { in: this.state[keyword].loading },
                style => {
                    return (
                        <div className='loading_spinner' style={style}>
                            <div className='spinner_large'></div>
                        </div>
                    );             
                },
                style => {
                    if (this.state[keyword].hidden) {
                        return '';
                    }
    
                    return (
                        <div className='content' style={style}>
                            {hasData ? this.renderFilter(keyword) : ''}
                            {this.renderTrips(keyword, trips)}  
                        </div>
                    );
                },
                300
            )
        }
        
        return (
            <div className={`way ${keyword}`}>
                <h1 className='title'>{title}</h1>
                {toggleContent()}
            </div>
        );
    }

    renderLoading() {
        if (this.state.depart.loading || this.state.return.loading) {
            return (
                <div className='loading_spinner'>
                    <div className='spinner_small'></div>
                </div>
            );
        }
    }

    render() {
        const {
            hasReturnDate,
            departTrip,
            returnTrip,
        } = this.props;

        return (
            <div className='search-result'>
                {this.renderLoading()}
                {this.renderWay(1, 'depart', departTrip)}
                {hasReturnDate ? this.renderWay(2, 'return', returnTrip) : ''}
            </div>
        );
    }
}


const mapStateToProps = ({ search }) => {
    const {
        origin,
        destination,
        departDate,
        hasReturnDate,
        returnDate,
    } = search.searchForm;

    const {
        departTrip,
        returnTrip, 
    } = search.searchResult

    return {
        origin,
        destination,
        departDate,
        hasReturnDate,
        returnDate,

        departTrip,
        returnTrip,
    }
}


export default connect(mapStateToProps, actions)(SearchResult);