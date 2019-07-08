// making this single file for now
// TODO: split after everything is working

/* modules */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Track = require('../models/track');

const config = require('../app/config/database');
const mongoose = require('mongoose');

/* setting up */

mongoose.connect(config.database, {useNewUrlParser: true})
.then(() => console.log("MongoDB connection established."))
.catch(err => {console.log(err)});

const port = 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});

/* requests and routing */

app.get("/test", (req, res) =>{
    console.log("connection tested");
    res.send("Server responded.");
});

/**
 * getAllTracks
 */
app.get("/", (req, res) => {
    console.log("----------------------------------------");
    Track.getAllTracks((err, tracks) => {
        if (err) {
            console.log("Error getting tracks");
        } else {
            console.log("request to / made");
            console.log(tracks);
            res.json(tracks);
        }
    });
});

/**
 * filter
 */
app.get("/filter", (req, res) => {
    console.log("----------------------------------------");
    console.log("Body: " + JSON.stringify(req.query));
    console.log("filtering: " + req.query.filter);
    Track.filter(req.query.filter, (err, tracks) => {
        if (err) {
            console.log("Error filtering tracks");
        } else {
            console.log(`Found ${tracks.length} records.`)
            res.json(tracks);
        }
    });
});

/**
 * addTrack
 */
app.post("/", (req, res) => {
    console.log("----------------------------------------");
    console.log("Adding new track...");
    console.log("Req :" + JSON.stringify(req.body));
    const newTrack = new Track({
        band: req.body.band,
        track: req.body.track,
        remix: req.body.remix,
        tags: req.body.tags
    });
    console.log("New track: " + newTrack);
    Track.addTrack(newTrack, (err, newTrack) => {
        if (err) {
            console.log("Error adding new track");
        } else {
            console.log("New track added!")
            res.json(newTrack);
        }
    });
});

/**
 * delete track
 * deletes all tracks on empty id
 */
app.delete("/:id", (req, res) => {
    console.log("--------------------");
    console.log("Deleting track (server): " + req.params.id);
    Track.delete(req.params.id, (err, response) => {
        if (err) {
            console.log("Error deleting track :" + JSON.stringify(err));
        } else {
            console.log("Delete operation successful");
            res.json(response);
        }
    });
});

/**
 * update track
 */
app.put("/:id", (req, res) => {
    console.log("--------------------");
    console.log("Updating track (server): " + req.params.id);
    console.log("Request body: " + JSON.stringify(req.body));
    Track.update(req.params.id, req.body, (err, response) => {
        if (err) {
            console.log("Error updating track :" + JSON.stringify(err));
        } else {
            console.log("Update operation successful.");
            res.json(response);
        }
    });
});