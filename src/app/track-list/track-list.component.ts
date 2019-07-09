import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Track } from '../track';
import { TrackJSON } from '../models/trackJSON';

import { MusicService } from '../music.service';

import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent implements OnInit {

  tracks$: Observable<TrackJSON[]>;
  newTrack: TrackJSON;
  adding = false;
  private filterTerms = new Subject<string>();

  // push new search term into observable stream
  search(term: string = ""): void {
    this.filterTerms.next(term);
  }

  constructor(private musicService: MusicService, private loggerService: LoggerService) {
  }

  ngOnInit() {
    this.tracks$ = this.filterTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.filterTracks(term))
    );
    setTimeout(function(){this.search("");}.bind(this), 0);

    this.newTrack = {
      _id: "",
      band: "",
      track: "",
      remix: "",
      tags: []
    };
  }
  
  public clear(): void {
    this.tracks$ = of(<TrackJSON[]>[]);
  }
  private getTracks() {
    this.musicService.getTracks().subscribe(tracks => this.tracks$ = of(tracks));
  }
  
  private addTrackModal() {
    this.loggerService.add("Adding new track");
    this.adding = true;
    $('#addTrackModal').modal('show');
    // const newTrack = <TrackJSON>{band: "bandName", track: "trackName"};
  }
  
  private addTrack(newTrack: TrackJSON) {
    this.musicService.addTrack(newTrack).subscribe(response => this.loggerService.add(JSON.stringify(response)));
  }

  private filterTracks(filter: string) {
    this.loggerService.add("Filtering : " + filter);
    return this.musicService.filterTracks(filter);
  }

}
