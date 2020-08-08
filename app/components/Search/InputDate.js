import React, { Component } from 'react';
import Calendar from './Calendar';
import { Fade } from '../../styles/transitions';


class InputDate extends Component {

    onArrowClick = (direction, calendarWidth) => {
        const inputDateWidth = this.refs.inputDate.offsetWidth;
        const multiplier = Math.floor(calendarWidth/inputDateWidth + 0.5);

        this.props.onCalendarArrowClick(direction, multiplier);
    }


    renderCalendar() {
        const {
            type,
            calendar,
            onOptionClick,
            activeInput,
            calendarPosition,
        } = this.props;

        return Fade({ in: type === activeInput }, style => {
            return (
                <Calendar
                    style={style}
                    type={type}
                    calendar={calendar}
                    calendarPosition={calendarPosition}
                    onArrowClick={this.onArrowClick}
                    onOptionClick={onOptionClick}
                />
            );
        });
    }


    render() {
        const {
            style,
            className,
            type,
            label,
            placeholder,
            search,
            onActiveInputChange,
        } = this.props;

        return (
            <div
                className={`input-search input-date ${className}`}
                style={style}
                ref='inputDate'
            >
                <label>{label}:</label>
                <input
                    type='input'
                    placeholder={placeholder}
                    onFocus={() => onActiveInputChange(type)}
                    value={search}
                    onChange={() => {}}
                />
                {this.renderCalendar()}
            </div>            
        );
    }
}


export default InputDate;