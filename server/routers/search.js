const Express = require('express');
const Passport = require('passport');

const PassportServices = require('../services/passport');
const SearchController = require('../controller/search');

const requireAuth = Passport.authenticate('jwt', { session: false });
const Router = Express.Router();


Router.get('/airport/origin', requireAuth, (req, res) => {
    SearchController.GetOriginAirports((err, rows) => {
        if (err){
            console.error(`Error GetOriginAirports: ${err}`);

            return res.status(500).json({ error: err });
        }

        return res.status(200).json(rows);
    });
});

Router.post('/airport/destination', requireAuth, (req, res) => {
    const { origin } = req.body;
    SearchController.GetDestinationAirports({ origin }, (err, rows) => {
        if (err) {
            console.error(`Error GetDestinationAirports: ${err}`);

            if (err.code && err.message) {
                return res.status(err.code).send({ error: err.message });
            } 
            
            return res.status(500).send({ error: err });
        }

        return res.status(200).send(rows);
    });
});

Router.post('/date/available', requireAuth, (req, res) => {
    const { origin, destination, min } = req.body;

    SearchController.GetAvailableDates({ origin, destination, min }, (err, rows) => {
        if (err) {
            console.error(`Error GetAvailableDates: ${err}`);

            if (err.code && err.message) {
                return res.status(err.code).send({ error: err.message });
            }
            
            return res.status(500).send({ error: err });
        }
        return res.status(200).send(rows);
    });
});


Router.post('/trips', requireAuth, (req, res) => {
    const { origin, destination, time } = req.body;

    SearchController.GetTrips({ origin, destination, time }, (err, rows) => {
        if (err) {
            console.error(`Error GetTrips: ${err}`);
            return res.status(500).send(err);
        }

        return res.status(200).send(rows);
    });

});
module.exports = Router;

