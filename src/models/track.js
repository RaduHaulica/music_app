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
    // Track.find({ $or : [ { band: { $regex: regex } }, { track: { $regex: regex } } ] }, callback);
    Track.find({ $or: [ { track: { $regex: filter, $options: "i" } }, { band: { $regex: filter, $options: "i" } }, { remix: { $regex: filter, $options: "i" } }, { tags: filter } ] }, callback);
}

module.exports.delete = (id, callback) => {
        console.log("Deleting (model) :" + id + " - " + typeof(id));
        if (id === "undefined") {
            console.log("Deleting many");
            Track.deleteMany({}, callback);
        } else {
            console.log("Deleting one");
            Track.deleteOne({_id: id}, callback);
        }
}

module.exports.update = (id, track, callback) => {
    console.log("Updating (model) :" + id + " - " + JSON.stringify(track));
    Track.findByIdAndUpdate(id, track, callback);
}