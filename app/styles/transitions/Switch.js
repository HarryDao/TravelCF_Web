import React from 'react';
import { Transition } from 'react-transition-group';


const Switch = ({ in: inProp }, ComponentIfTrue, ComponentIfFalse, duration = 300) => {
    const defaultStyleTrue = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
        display: 'none',
    }

    const defaultStyleFalse = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 1,
        display: 'block',
    }

    const transitionStylesTrue = {
        entering: { opacity: 0, display: 'block' },
        entered: { opacity: 1, display: 'block' },
        exiting: { opacity: 0, display: 'none' },        
    }
    
    const transitionStylesFalse = {
        entering: { opacity: 1, display: 'none' },
        entered: { opacity: 0, display: 'none' },
        exiting: { opacity: 0, display: 'block' },
    }

    const createComponents = (state) => {
        const transitionStyleTrue = transitionStylesTrue[state];
        const transitionStyleFalse = transitionStylesFalse[state];
        return [
            ComponentIfTrue({ ...defaultStyleTrue, ...transitionStyleTrue }),
            ComponentIfFalse({ ...defaultStyleFalse, ...transitionStyleFalse })
        ];
    }

    return (
        <Transition in={inProp} timeout={duration}>
            {state => createComponents(state)}
        </Transition>
    )
}


export { Switch };