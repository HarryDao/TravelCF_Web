import React, { Component } from 'react';
import { Transition } from 'react-transition-group';


const Fade = ({ in: inProp }, componentCreator, duration = 300) => {
    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
        display: 'none',
    };

    const transitionStyles = {
        entering: { opacity: 0, display: 'block' },
        entered: { opacity: 1, display: 'block' },
        exiting: { opacity: 0, display: 'block' },
    };

    const createComponent = (state) => {
        const transitionStyle = transitionStyles[state];
        return componentCreator({ ...defaultStyle, ...transitionStyle });
    }
    

    return (
        <Transition in={inProp} timeout={duration}>
            {state => createComponent(state)}
        </Transition>
    );
}


export { Fade };


