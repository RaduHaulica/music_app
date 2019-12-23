/* config */
require('dotenv').config();

const mongoose = require('mongoose');

// DB_CLOUD_HOSTNAME = 'mongodb+srv://adminadmin:adminadmin@cluster0-q49zy.mongodb.net/test?retryWrites=true&w=majority';

// const cloudConnection = mongoose.createConnection('mongodb+srv://adminadmin:adminadmin@cluster0-q49zy.mongodb.net/test', {useNewUrlParser: true})
// .then(() => console.log("Cloud DB connection established."))
// .catch(err => {console.log(err)});

// JSON schemas
const CloudTrackSchema = mongoose.Schema({
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

const CloudTrack = module.exports = mongoose.model('CloudTrack', CloudTrackSchema);

module.exports.getAllTracks = (callback) => {
    CloudTrack.find(callback);
}

module.exports.getTrack = (id, callback) => {
    CloudTrack.findById(id, callback);
}

module.exports.addTrack = (newCloudTrack, callback) => {
    newCloudTrack.save(callback);
}

module.exports.filter = (filter, callback) => {
    if (filter === undefined || filter === "") {
        CloudTrack.find(callback);
        return;
    }
    // Track.find({ $or : [ { band: { $regex: regex } }, { track: { $regex: regex } } ] }, callback);
    CloudTrack.find({ $or: [ { track: { $regex: filter, $options: "i" } }, { band: { $regex: filter, $options: "i" } }, { remix: { $regex: filter, $options: "i" } }, { tags: filter } ] }, callback);
}

module.exports.delete = (id, callback) => {
        console.log("Deleting (model) :" + id + " - " + typeof(id));
        if (id === "undefined") {
            console.log("Deleting many");
            CloudTrack.deleteMany({}, callback);
        } else {
            console.log("Deleting one");
            CloudTrack.deleteOne({_id: id}, callback);
        }
}

module.exports.update = (id, track, callback) => {
    console.log("Updating (model) :" + id + " - " + JSON.stringify(track));
    CloudTrack.findByIdAndUpdate(id, track, callback);
}