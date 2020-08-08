import React, { Component } from 'react';
import {
    MONTH_NAMES, 
    rearrangeMonthIntoWeeks, 
    composeDateText
} from './helpers/time';


class Calendar extends Component {
    
    onDateClick = (value, text, date) => {
        const { type, onOptionClick } = this.props;

        if (date.available && date.available[type]) {
            onOptionClick(type, value, text);
        }
    }


    onArrowClick = (direction) => {
        this.props.onArrowClick(direction, this.refs.calendar.offsetWidth);
    }

    renderDate(year, month, weekIndex, date) {
        const { type } = this.props;
        const key = `${type}-${year}/${month}/${weekIndex}/${date.day}`;
        let className = '';

        if (!date.date) {
            className += ' disabled';
        }

        if (date.available && date.available[type]) {
            className += ' available';
        }

        if (date.departDate) {
            className += ' depart-date';
        }

        if (date.returnDate) {
            className += ' return-date';
        }

        if (date.stayDate) {
            className += ' stay-date';
        }

        const text = date.date ? composeDateText(year, month, date.date) : '';
        const value = { year, month, date: date.date };

        return (
            <td
                key={key}
                className={className + ' ' + text}
                onClick={() => {this.onDateClick(value, text, date)}}
            >
                <a>
                    {date.date || ''}
                </a>
            </td>
        );
    }


    renderWeek(year, month, week, index) {
        const key = `${name}-${year}/${month}/${index}`;

        week = week.map(date => this.renderDate(year, month, index, date));

        return (
            <tr key={key}>
                {week}
            </tr>
        );
    }


    renderMonth({ year, month, dates }) {
        const { type } = this.props;
        const key = `${type}${year}/${month}`;

        let weeks = rearrangeMonthIntoWeeks(dates);
        weeks = weeks.map((week, index) => this.renderWeek(year, month, week, index));

        return (
            <table
                key={key}
                className='month' 
            >
                <thead>
                    <tr>
                        <td colSpan={7} className='month-name'>
                            {MONTH_NAMES[month - 1]} {year}
                        </td> 
                    </tr>
                    <tr>
                        <td>S</td>
                        <td>M</td>
                        <td>T</td>
                        <td>W</td>
                        <td>T</td>
                        <td>F</td>
                        <td>S</td>
                    </tr>
                </thead>
                <tbody>
                    {weeks}
                </tbody>
            </table>
        );
    }


    renderYear() {
        const { calendar } = this.props;

        let months = [];
        for (let year in calendar) {
            for (let month in calendar[year]) {
                months.push({
                    year,
                    month,
                    dates: calendar[year][month],
                });
            }
        }

        return months.map(month => this.renderMonth(month));
    }


    render() {
        const {
            style,
            calendarPosition,
        } = this.props;

        const calendarPositionStyle = {
            marginLeft: `${calendarPosition.marginLeft}%`
        };

        return (
            <div className='calendar' style={style}  ref='calendar'>
                <div className='inner'>
                    <a
                        className='arrow left'
                        onClick={() => {this.onArrowClick('left')}}
                    ><i className="fa fa-angle-double-left"></i></a>
                    
                    <a
                        className='arrow right'
                        onClick={() => {this.onArrowClick('right')}}
                    ><i className="fa fa-angle-double-right"></i></a>

                    <div className='months' style={calendarPositionStyle}>
                        {this.renderYear()}
                    </div>
                </div>
            </div>
        );
    }
}


export default Calendar;