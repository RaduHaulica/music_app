const mongoose = require('mongoose');

// JSON schemas
const TrackSchema = mongoose.Schema({
    track: {
        type: String,
    },
    band: {
        type: String,
    },
    remix: {
        type: String
    },
    tags: {
        type: [String]
    }
});

// exported API

const Track = module.exports = mongoose.model('Track', TrackSchema);

module.exports.getAllTracks = (callback) => {
    Track.find(callback);
}

module.exports.getTrack = (id, callback) => {
    Track.findById(id, callback);
}

module.exports.addTrack = (newTrack, callback) => {
    newTrack.save(callback);
}

module.exports.filter = (filter, callback) => {
    if (filter === undefined || filter === "") {
        Track.find(callback);
        return;
    }
    const regex = `/${filter}/`;
    // Track.find({ $or : [ { band: { $regex: regex } }, { track: { $regex: regex } } ] }, callback);
    Track.find({ $or: [ { track: { $regex: filter } }, { band: { $regex: filter } } ] }, callback);
}