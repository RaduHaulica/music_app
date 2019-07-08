# Music filter

App that takes a list of songs and enables filtering by track name, artist, genre etc.

The goal is to have a lists of nice songs to play at impromptu parties without having to burden your brain with actually remembering any songs of an appropriate genre.

End goal is to do it without having to manually manage youtube while still keeping authoritarian control over what is played. No surprises. No unvetted or subversive tracks. Only party-approved bangers.

## Dev notes

Added backend (node, express, mongoDB).

Added a lot of logging (frontend and backend) due to issues with HTTP requests. Everything works now. Still keeping logging until everything is up and running.

Database connection works, tracks are imported from hardcoded values, fallback on hardcoded values if no connection can be established.

Added test component for quickly trying things out.

Deleting works. Editing (almost) works. TODO: tags array

Filtering is live on providing input (case insensitive).

TODO: Tags make filtering by genre easier.

TODO: Add new track

TODO: Youtube

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.