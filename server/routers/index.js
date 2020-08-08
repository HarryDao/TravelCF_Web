const UserRouter = require('./user');
const SearchRouter = require('./search');

module.exports = (app) => {        
    app.use('/api/user', UserRouter);
    app.use('/api/search', SearchRouter);
};