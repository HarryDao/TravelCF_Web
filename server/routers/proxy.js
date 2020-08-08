const Request = require('request');
const { TRUE_SERVER } = require('../../configs/server');

module.exports = (app) => {
    app.use('/api', (req, res) => {
        const { method, headers, originalUrl, body } = req;
        const options = {
            url: TRUE_SERVER + originalUrl,
            headers,
            method: method.toLowerCase(),
            body,
            json: true
        };
    
        Request(options, (err, response, body) => {
            return res.status(response.statusCode).send(err || body);
        });
    });
}