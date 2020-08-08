export default ({ dispatch }) => {
    return next => action => {
        if (action && typeof action === 'function'){
            return action(dispatch);
        }

        return next(action);
    }
}