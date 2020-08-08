import React from 'react';
import { Fade } from '../../../styles/transitions';


const displayMessage = (message, className) => {
    return Fade(
        { in: message ? true : false }, 
        style => {
            return <p className={className} style={style}>{message}</p>
        }, 
        200
    );
}

export { displayMessage };