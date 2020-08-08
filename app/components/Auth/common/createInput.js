import React from 'react';
import { Fade } from '../../../styles/transitions';


const createInput = (field) => {
    const {
        label, 
        type, 
        placeholder,
        meta: { touched, error },
        additionalClass,
        style,
    } = field;
    
    const className = touched && error ? 'error' : ''

    if (type === 'checkbox') {
        return (
            <div className={`input-group ${additionalClass}`} style={style || {}}>
                <label>
                    <input
                        className={className}
                        type={type}
                        placeholder={placeholder}
                        { ...field.input }
                    />
                    {label}
                </label>
                {RenderError(touched, error)}
            </div>
        );
    }

    return (
        <div className={`input-group ${additionalClass}`} style={style || {}}>
            <label>{label}:</label>
            <input
                className={className}
                type={type}
                placeholder={placeholder}
                { ...field.input }
            />
            {RenderError(touched, error)}
        </div>      
    );
}

const RenderError = (touched, error) => {
    return Fade(
        { in: touched && error ? true: false }, 
        style => {
            return <p className="error" style={style}>{error || ''}</p>;
        }, 
        100
    );
}

export { createInput };