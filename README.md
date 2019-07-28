# Music filter

App that takes a list of songs and enables filtering by track name, artist, genre etc.

The goal is to have a lists of nice songs to play at impromptu parties without having to burden your brain with actually remembering any songs of an appropriate genre.

End goal is to do it without having to manually manage youtube while still keeping authoritarian control over what is played. No surprises. No unvetted or subversive tracks. Only party-approved bangers.

## Architecture

**Components**
* `TrackComponent` - individual track badge - delete, edit
* `TrackListComponent` - lists tracks - search, add
* `MessagesComponent` - lists logger messages
* `TestComponent` - miscellaneous functionality tests and admin level controls

**Services**
* `MusicService` - handles data operations, database server connection
* `LoggerService` - message list, handles app-level operation logging

**DB server**
* `server/server.js` - handles HTTP requests / routing
* `model/track.js` - MongoDB model, JSON schemas, database API

## Dev notes

**Latest**: Added tags support to add new track form.

Added full tags support to edit form. Loading and saving to DB.

Added backend (node, express, mongoose - mongoDB).

`npm run start` => Runs `ng serve` and `node server.js` concurrently.

Added a lot of logging (frontend and backend) due to issues with HTTP requests. Keeping logging until everything is up and running.

Database connection works, tracks are imported from hardcoded values, fallback on hardcoded values if no connection can be established.

Added test component for quickly trying things out and for reseting the track list until all operations are working.

**Operations**
* Adding new tracks works.
* Deleting tracks works.
* Editing tracks works.
* Filtering is live on providing input (case insensitive).

### TODOs

* Youtube integration - soon™

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.