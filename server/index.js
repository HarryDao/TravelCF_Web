const Express = require('express');
const BodyParser = require('body-parser');
const Morgan = require('morgan');
const Path = require('path');
const CORS = require('cors');
const { PORT } = require('../configs/server');

const app = Express();

app.use(CORS());
app.use(BodyParser.json({ type: '*/*' }));
app.use(Morgan('dev'));

// For heroku setup to combine server and front end

app.use(Express.static(Path.join(__dirname, '../dist'))); 

const routers = require('./routers');
routers(app);

app.get('*', (req, res) => {
    res.sendFile(Path.join(__dirname, '../dist/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server serving on port ${PORT}`);
});

