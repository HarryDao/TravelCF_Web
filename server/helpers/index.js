exports.mapArrayToObject = (array, field, orderBy) => {
    if (!array || !field || array.length < 1) {
        return array;
    }

    if (orderBy) {
        array = array.sort((a, b) => {
            return a[orderBy] > b[orderBy] ? 1: -1;
        });
    }

    array = array.reduce((obj, item) => {
        obj[item[field]] = item;
        return obj;
    }, {});

    return array;
}

exports.composeDate = (year, month = 1, date = 1, hour = 0, minute = 0) => {
    if (!year) {
        return null;
    }

    const dateUTC = Date.UTC(year, month ? month - 1 : 0, date || 1, hour || 0, minute || 0, 0);
    const output = new Date(dateUTC);

    return {
        date: output,
        string: JSON.stringify(output).replace(/\"/g, ''),
        number: output.getTime(),
    }
}