import { Component, OnInit } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Track } from '../track';

import { MusicService } from '../music.service';

import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent implements OnInit {

  tracks$: Observable<Track[]>;
  private filterTerms = new Subject<string>();

  // push new search term into observable stream
  search(term: string = ""): void {
    this.filterTerms.next(term);
  }

  constructor(private musicService: MusicService, private logger: LoggerService) {
  }

  ngOnInit() {
    // this.getTracks();
    this.tracks$ = this.filterTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.musicService.filterTracks(term))
    );
    setTimeout(function(){this.search("");}.bind(this), 0);
  }
  
  public clear(): void {
    this.tracks$ = of(<Track[]>[]);
  }
  private getTracks() {
    this.musicService.getTracks().subscribe(tracks => this.tracks$ = of(tracks));
  }
  // public filterTracks(filter: string) {
  //   this.tracks$ = this.musicService.filterTracks(filter); //.subscribe(tracks => this.tracks$ = of(tracks));
  // }

}
